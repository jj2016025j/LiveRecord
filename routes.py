import os
import multiprocessing
from flask import Flask, jsonify, request
from data_store import generate_unique_id, get_live_stream_url, read_json_file, write_json_file
from recording import record_stream, generate_filename
from dotenv import load_dotenv

# 載入 .env 文件中的環境變數
load_dotenv()

# 從環境變數中讀取 JSON 文件路徑
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')

def process_url_or_name(url, data, name=None):
    stream_url, status = get_live_stream_url(url)
    if status in ["online", "offline"]:
        new_id = generate_unique_id()
        return {
            "id": new_id,
            "name": name or url.split('/')[-2],
            "url": url,
            "status": status,
            "isFavorite": data.get('isFavorite', False),
            "autoRecord": data.get('autoRecord', False),
            "viewed": data.get('viewed', False),
            "stream_url": stream_url
        }
    return None

def update_data_store_and_file(data_store, new_item):
    data_store["live_list"].append(new_item)
    data = read_json_file(JSON_FILE_PATH)
    data["live_list"].append(new_item)
    write_json_file(data, JSON_FILE_PATH)

def setup_routes(app, data_store):
    @app.route('/api/queryandaddlist', methods=['POST'])
    def query_and_add_list():
        data = request.json
        url_or_name_or_id = data.get('urlOrNameOrId')
        
        print(f"接收到的資料：{data}")
        print(f"處理的網址或名稱或ID：{url_or_name_or_id}")

        existing_item = next((item for item in data_store["live_list"] if item.get("id") == url_or_name_or_id or item.get("url") == url_or_name_or_id or item.get("name") == url_or_name_or_id), None)
        if existing_item:
            stream_url, status = get_live_stream_url(existing_item["url"])
            print(f"嘗試取得直播流：{existing_item}")
            existing_item["live_stream_url"] = stream_url
            existing_item["status"] = status
            print(f"已存在的項目：{existing_item}")
            return jsonify(existing_item), 200
        
        if "chaturbate.com" in url_or_name_or_id:
            new_item = process_url_or_name(url_or_name_or_id, data)
        else:
            test_url = f"https://chaturbate.com/{url_or_name_or_id}/"
            new_item = process_url_or_name(test_url, data, url_or_name_or_id)
        
        if new_item:
            update_data_store_and_file(data_store, new_item)
            print(f"新增的項目：{new_item}")
            return jsonify(new_item), 201
        print("未找到頁面")
        return jsonify({"message": "Page not found"}), 404

    @app.route('/api/deletelist', methods=['DELETE'])
    def delete_list():
        data = request.json
        url_or_name_or_id = data['urlOrNameOrId']
        
        print(f"刪除的網址或名稱或ID：{url_or_name_or_id}")
        
        for item in data_store["live_list"]:
            if item.get("id") == url_or_name_or_id or item.get("url") == url_or_name_or_id or item.get("name") == url_or_name_or_id:
                data_store["live_list"].remove(item)
                write_json_file(data_store)
                print(f"已刪除的項目：{item}")
                return jsonify({"message": "Item deleted"}), 200
        print("未找到項目")
        return jsonify({"message": "Item not found"}), 404

    @app.route('/api/updateliststatus', methods=['PUT'])
    def update_list_status():
        data = request.json
        url_or_name_or_id = data['urlOrNameOrId']
        
        print(f"更新的網址或名稱或ID：{url_or_name_or_id}")
        
        for item in data_store["live_list"]:
            if item.get("id") == url_or_name_or_id or item.get("url") == url_or_name_or_id or item.get("name") == url_or_name_or_id:
                item["isFavorite"] = data["isFavorite"]
                item["autoRecord"] = data["autoRecord"]
                item["viewed"] = data["viewed"]
                if item["autoRecord"]:
                    if item["id"] not in data_store["auto_record"]:
                        data_store["auto_record"].append(item["id"])
                else:
                    if item["id"] in data_store["auto_record"]:
                        data_store["auto_record"].remove(item["id"])
                write_json_file(data_store)
                print(f"更新的項目：{item}")
                return jsonify(item), 200
        print("未找到項目")
        return jsonify({"message": "Item not found"}), 404

    @app.route('/api/getlist', methods=['GET'])
    def get_list():
        current_page = request.args.get("currentPage", type=int, default=1)
        page_size = request.args.get("pageSize", type=int, default=10)
        is_favorite = request.args.get("isFavorite", type=lambda v: v.lower() == 'true' if v else None)
        auto_record = request.args.get("autoRecord", type=lambda v: v.lower() == 'true' if v else None)
        watched = request.args.get("watched", type=lambda v: v.lower() == 'true' if v else None)
        
        filtered_list = data_store["live_list"]
        
        if is_favorite is not None:
            filtered_list = [item for item in filtered_list if item["isFavorite"] == is_favorite]
        
        if auto_record is not None:
            filtered_list = [item for item in filtered_list if item["autoRecord"] == auto_record]
        
        if watched is not None:
            filtered_list = [item for item in filtered_list if item["watched"] == watched]
        
        total_records = len(filtered_list)
        total_pages = (total_records + page_size - 1) // page_size
        
        start = (current_page - 1) * page_size
        end = start + page_size
        paginated_list = filtered_list[start:end]
        
        response = {
            "channelList": paginated_list,
            "totalRecords": total_records,
            "totalPages": total_pages,
            "currentPage": current_page,
            "pageSize": page_size
        }
        print(f"查詢結果：{response}")
        return jsonify(response), 200

    @app.route('/api/recordingcontrol', methods=['POST'])
    def recording_control():
        data = request.json
        recording_id = data["id"]
        option_type = data["optionType"]

        print(f"錄製控制 - ID：{recording_id}，操作類型：{option_type}")

        for item in data_store["live_list"]:
            if item["id"] == recording_id:
                if option_type == "start":
                    if item["url"] in data_store["online_streams"]:
                        print(f"已經在錄製中：{item['url']}")
                        return jsonify({"id": recording_id, "optionType": option_type, "status": "Already recording"}), 400
                    
                    try:
                        stream_url, status = get_live_stream_url(item["url"])
                        if status == "online":
                            filename_template = generate_filename(item["url"])
                            process = multiprocessing.Process(target=record_stream, args=(stream_url, filename_template))
                            process.start()
                            data_store["online_streams"][item["url"]] = process
                            print(f"開始錄製：{item['url']}")
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording started"}), 200
                        else:
                            print(f"直播流不在線：{item['url']}")
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Stream offline"}), 400
                    except Exception as e:
                        print(f"開始錄製時出錯：{str(e)}")
                        return jsonify({"id": recording_id, "optionType": option_type, "status": f"Error starting recording: {str(e)}"}), 500

                elif option_type == "stop":
                    if item["url"] in data_store["online_streams"]:
                        process = data_store["online_streams"][item["url"]]
                        process.terminate()
                        process.join()
                        del data_store["online_streams"][item["url"]]
                        print(f"停止錄製：{item['url']}")
                        return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording stopped"}), 200
                    else:
                        print(f"未找到錄製：{item['url']}")
                        return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording not found"}), 404
        print("未找到ID")
        return jsonify({"id": recording_id, "optionType": option_type, "status": "ID not found"}), 404

from datetime import datetime
import os
import multiprocessing
from flask import jsonify, render_template_string, request
from file.file_operations import write_json_file
from recording.get_live_stream_url import repeat_get_live_stream_url
from recording.recording import capture_preview_image, record_stream
from dotenv import load_dotenv
from store.data_processing import process_url_or_name
from store.data_store import update_data_store_and_file
from utils.utils import generate_filename
from utils.logging_setup import error_logger

# 載入 .env 文件中的環境變數
load_dotenv()

# 從環境變數中讀取 JSON 文件路徑
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')
PREVIEW_IMAGE_DIR = os.getenv('PREVIEW_IMAGE_DIR', r'src\assets')
FILE_PATH = os.getenv('FILE_PATH', r'/Users/leechiensheng/Movies')
    
def setup_routes(app, data_store, data_lock):

    @app.route('/', methods=['GET'])
    def health_check():
        html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Health Check</title>
        </head>
        <body>
            <h1>系統運作正常</h1>
            <p>點擊以下連結以確認系統正常運作：</p>
            <ul>
                <li><a href="http://127.0.0.1:5555">http://127.0.0.1:5555</a></li>
                <li><a href="http://192.168.1.243:5555">http://192.168.1.243:5555</a></li>
            </ul>
        </body>
        </html>
        """
        return render_template_string(html_content)  
          
    @app.route('/api/queryandaddlist', methods=['POST'])
    def query_and_add_list():
        # try:
            data = request.json
            url_or_name_or_id = data.get('urlOrNameOrId').strip()
            
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with data_lock:
                search_history = data_store["search_history"]
                search_history.append({url_or_name_or_id, current_time})
                data_store["search_history"] = search_history
                
            print(f"正在處理的網址或名稱或ID: {url_or_name_or_id}")

            if url_or_name_or_id is None:
                raise ValueError("沒有值: 'urlOrNameOrId'")

            if not url_or_name_or_id:
                print("未提供網址或名稱或ID")
                return jsonify({"message": "未提供網址或名稱或ID"}), 400

            with data_lock:
                updated_live_list = data_store["live_list"]

            existing_item = next((item for item in updated_live_list if item.get("id") == url_or_name_or_id or item.get("url") == url_or_name_or_id or item.get("name") == url_or_name_or_id), None)
            if existing_item:
                print(f"已存在項目: ")
                live_stream_url, status = repeat_get_live_stream_url(existing_item["url"])
                print(f"嘗試取得直播流: {live_stream_url}，狀態: {status}")
                existing_item["live_stream_url"] = live_stream_url
                existing_item["status"] = status
                # 捕捉直播流預覽圖片
                if live_stream_url and status=='online':
                    preview_image_path = capture_preview_image(live_stream_url, PREVIEW_IMAGE_DIR)
                    existing_item["preview_image"] = preview_image_path
                    url = existing_item["url"]
                    filename_template = generate_filename(url)
                    process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template, data_store, data_lock, url))                   
                    process.start()

                for idx, item in enumerate(updated_live_list):
                    if item.get("id") == existing_item["id"]:
                        updated_live_list[idx] = existing_item
                        break
                with data_lock:
                    data_store["live_list"] = updated_live_list
                return jsonify(existing_item), 200

            else:
                print(f"不存在項目: ")
                if "chaturbate.com" in url_or_name_or_id:
                    print('用網址創建資料')
                    new_item = process_url_or_name(data_store, data_lock, url_or_name_or_id)
                else:
                    print('用網址創建資料')
                    test_url = f"https://chaturbate.com/{url_or_name_or_id}/"
                    new_item = process_url_or_name(data_store, data_lock, test_url, url_or_name_or_id)

                if new_item:
                    filename_template = generate_filename(new_item['url'])
                    print(f'取得新資料及影片儲存地址，開始錄製...')
                    process = multiprocessing.Process(target=record_stream, args=(new_item['live_stream_url'], filename_template, data_store, data_lock, new_item['url']))
                    process.start()
                    print(f'正在錄製...')
                    print('嘗試更新檔案')
                    update_data_store_and_file(data_store, new_item, data_lock)
                    print('更新檔案完畢')
                    return jsonify(new_item), 201

            print("未找到頁面")
            return jsonify({"message": "未找到頁面"}), 404

        # except KeyError as e:
        #     error_logger.error(f"鍵錯誤: {e}")
        #     return jsonify({"message": f"鍵錯誤: {e}"}), 500
        # except TypeError as e:
        #     error_logger.error(f"類型錯誤: {e}")
        #     return jsonify({"message": f"類型錯誤: {e}"}), 500
        # except ValueError as e:
        #     error_logger.error(f"值錯誤: {e}")
        #     return jsonify({"message": f"值錯誤: {e}"}), 500
        # except Exception as e:
        #     error_logger.error(f"發生未知錯誤: {e}")
        #     return jsonify({"message": f"發生未知錯誤: {e}"}), 500

    @app.route('/api/deletelist', methods=['DELETE'])
    def delete_list():
        data = request.json
        url_or_name_or_id = data['urlOrNameOrId']

        print(f"刪除的網址或名稱或ID：{url_or_name_or_id}")
        with data_lock:
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

        with data_lock:
            updated_live_list = data_store["live_list"]
            updated_favorites = data_store["favorites"]
            updated_auto_record = data_store["auto_record"]
            for item in updated_live_list:
                if item.get("id") == url_or_name_or_id or item.get("url") == url_or_name_or_id or item.get("name") == url_or_name_or_id:
                    print(f"更新的項目：{item}")
                    item["isFavorite"] = data["isFavorite"]
                    item["autoRecord"] = data["autoRecord"]
                    item["viewed"] = data["viewed"]
                    if item["isFavorite"]:
                        if item["id"] not in updated_favorites:
                            updated_favorites.append(item["id"])
                            print(f'數量:{len(updated_favorites)}')
                    else:
                        if item["id"] in updated_favorites:
                            updated_favorites.remove(item["id"])
                            print(f'數量:{len(updated_favorites)}')
                    if item["autoRecord"]:
                        if item["id"] not in updated_auto_record:
                            updated_auto_record.append(item["id"])
                            print(f'數量:{len(updated_auto_record)}')
                    else:
                        if item["id"] in updated_auto_record:
                            updated_auto_record.remove(item["id"])
                            print(f'數量:{len(updated_auto_record)}')

                    data_store["live_list"] = updated_live_list
                    data_store["favorites"] = updated_favorites
                    data_store["auto_record"] = updated_auto_record
                    print(f"更新後資料：{len(data_store['live_list'])}")
                    write_json_file(data_store)
                    return jsonify(item), 200
        print("未找到項目")
        return jsonify({"message": "Item not found"}), 404
    
    @app.route('/api/channels', methods=['GET'])
    def get_channels():
        try:
            with data_lock:
                auto_record = data_store.get("auto_record", [])
                live_list = data_store.get("live_list", [])

                # 根據 auto_record 的狀態過濾 live_list
                channels = [channel for channel in live_list if channel["url"] in auto_record]

            return jsonify(channels), 200
        except Exception as e:
            error_logger.error(f"發生未知錯誤: {e}")
            return jsonify({"error": f"發生未知錯誤: {e}"}), 500
    
    @app.route('/api/getlist', methods=['POST'])
    def get_list():
        # try:
            print('開始查詢')
            data = request.get_json()
            
            current_page = data.get("currentPage", 1)
            page_size = data.get("pageSize", 10)
            search_query = data.get("searchQuery", "")
            filters = data.get('filters', {})
            sorter = data.get('sorter', {})
            # print(current_page)
            # print(page_size)
            # print(search_query)
            # print(filters)
            # print(sorter)

            print('取得查詢需求')
            with data_lock:
                filtered_list = data_store["live_list"]

            # 应用过滤条件
            if 'autoRecord' in filters and filters['autoRecord']:
                auto_record_filters = filters['autoRecord']
                filtered_list = [
                    item for item in filtered_list 
                    if ('true' in auto_record_filters and item["autoRecord"]) or 
                    ('false' in auto_record_filters and not item["autoRecord"])
                ]

            if 'preview_image' in filters and filters['preview_image']:
                preview_image_filters = filters['preview_image']
                filtered_list = [
                    item for item in filtered_list 
                    if ('haveImage' in preview_image_filters and item.get("preview_image")) or 
                    ('noImage' in preview_image_filters and not item.get("preview_image"))
                ]

            if 'status' in filters and filters['status']:
                status_filters = filters['status']
                filtered_list = [
                    item for item in filtered_list 
                    if item["status"] in status_filters
                ]

            if search_query:
                search_query_lower = search_query.lower()
                print(f'search_query_lower: {search_query_lower}')
                filtered_list = [
                    item for item in filtered_list if (
                        (item.get("id") and search_query_lower in item["id"].lower()) or
                        (item.get("name") and search_query_lower in item["name"].lower()) or
                        (item.get("url") and search_query_lower in item["url"].lower()) or
                        (item.get("live_stream_url") and search_query_lower in item["live_stream_url"].lower()) or
                        (item.get("status") and search_query_lower in item["status"].lower())
                    )
                ]

            # 应用排序
            if 'field' in sorter and 'order' in sorter:
                sorter_key = sorter['field']
                sorter_order = sorter['order']
                reverse = sorter_order == 'descend'
                if sorter_key in ["id", "name", "url"]:
                    filtered_list = sorted(filtered_list, key=lambda x: x.get(sorter_key, ''), reverse=reverse)

            total_records = len(filtered_list)
            total_pages = (total_records + page_size - 1) // page_size

            start = (current_page - 1) * page_size
            end = start + page_size
            paginated_list = filtered_list[start:end]

            serverStatus = 'success' if paginated_list else 'false'

            response = {
                "channelList": paginated_list,
                "totalCount": total_records,
                "totalPages": total_pages,
                "currentPage": current_page,
                "pageSize": page_size,
                "serverStatus": serverStatus
            }

            if not paginated_list:
                print('未初始化完成或沒有資料')
            else:
                print(f"查詢成功：取得{len(paginated_list)}筆資料")

            return jsonify(response), 200

        # except KeyError as e:
        #     error_logger.error(f"鍵錯誤: {e}")
        #     return jsonify({"error": f"鍵錯誤: {e}"}), 400
        # except Exception as e:
        #     error_logger.error(f"發生未知錯誤: {e}")
        #     return jsonify({"error": f"發生未知錯誤: {e}"}), 500
    
    @app.route('/api/recordingcontrol', methods=['POST'])
    def recording_control():
        data = request.json
        recording_id = data["id"]
        option_type = data["optionType"]

        print(f"錄製控制 - ID：{recording_id}，操作類型：{option_type}")
        with data_lock:
            live_list = data_store["live_list"]
            online = data_store["online"]
        for item in live_list:
            if item["id"] == recording_id:
                if option_type == "start":
                    if item["url"] in online:
                        print(f"已經在錄製中：{item['url']}")
                        return jsonify({"id": recording_id, "optionType": option_type, "status": "Already recording"}), 400

                    try:
                        live_stream_url, status = repeat_get_live_stream_url(item["url"])
                        if status == "online":
                            filename_template = generate_filename(item["url"], FILE_PATH)
                            process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template, data_store, data_lock, item["url"]))                   
                            process.start()
                            with data_lock:
                                data_store["online"][item["url"]] = process
                            print(f"開始錄製：{item['url']}")
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording started"}), 200
                        else:
                            print(f"直播流不在線：{item['url']}")
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Stream offline"}), 400
                    except Exception as e:
                        error_logger.error(f"開始錄製時出錯：{str(e)}")
                        return jsonify({"id": recording_id, "optionType": option_type, "status": f"Error starting recording: {str(e)}"}), 500

                elif option_type == "stop":
                    with data_lock:
                        if item["url"] in data_store["online"]:
                            process = data_store["online"][item["url"]]
                            process.terminate()
                            process.join()
                            del data_store["online"][item["url"]]
                            print(f"停止錄製：{item['url']}")
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording stopped"}), 200
                        else:
                            print(f"未找到錄製：{item['url']}")
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording not found"}), 404
        print("未找到ID")
        return jsonify({"id": recording_id, "optionType": option_type, "status": "ID not found"}), 404
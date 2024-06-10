import multiprocessing
from flask import jsonify, request
from data_store import generate_unique_id, get_live_stream_url, read_json_file, write_json_file
from recording import record_stream, generate_filename

JSON_FILE_PATH = 'live_list.json'

def process_url_or_name(url, data, name=None):
        stream_url, status = get_live_stream_url(url)
        if status in ["Online", "Offline"]:
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

def setup_routes(app, data_store):
    @app.route('/api/queryandaddlist', methods=['POST'])
    def query_and_add_list():
        try:
            data = request.json
            url_or_name_or_id = data.get('urlOrNameOrId')
            
            # 檢查是否為ID
            existing_item = next((item for item in data_store["live_list"] if item.get("id") == url_or_name_or_id or item.get("url") == url_or_name_or_id or item.get("name") == url_or_name_or_id), None)
            if existing_item:
                stream_url, status = get_live_stream_url(existing_item["url"])
                print(stream_url, status)
                existing_item["live_stream_url"] = stream_url
                existing_item["status"] = status
                print(existing_item)
                return jsonify(existing_item), 200
            
            # 檢查是否為URL或名稱
            if "chaturbate.com" in url_or_name_or_id:
                # 可能是URL
                new_item = process_url_or_name(url_or_name_or_id, data)
            else:
                # 可能是名稱
                test_url = f"https://chaturbate.com/{url_or_name_or_id}/"
                new_item = process_url_or_name(test_url, data, url_or_name_or_id)
            
            if new_item:
                data_store["live_list"].append(new_item)
                data = read_json_file(JSON_FILE_PATH)
                data["live_list"].append(new_item)
                write_json_file(data, JSON_FILE_PATH)

                return jsonify(new_item), 201
            return jsonify({"message": "Page not found"}), 404
        finally:
            print()
    
    @app.route('/api/deletelist', methods=['DELETE'])
    def delete_list():
        try:
            data = request.json
            url_or_name_or_id = data['urlOrNameOrId']
            
            # 检查是否为ID、URL或名称
            for item in data_store["live_list"]:
                if item.get("id") == url_or_name_or_id or item.get("url") == url_or_name_or_id or item.get("name") == url_or_name_or_id:
                    data_store["live_list"].remove(item)
                    write_json_file(data_store)
                    return jsonify({"message": "Item deleted"}), 200
            return jsonify({"message": "Item not found"}), 404
        finally:
            print()

    @app.route('/api/updateliststatus', methods=['PUT'])
    def update_list_status():
        try:
            data = request.json
            url_or_name_or_id = data['urlOrNameOrId']
            
            # 檢查是否為ID
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
                    return jsonify(item), 200
            return jsonify({"message": "Item not found"}), 404
        finally:
            print()

    @app.route('/api/getlist', methods=['GET'])
    def get_list():
        try:
            current_page = request.args.get("currentPage", type=int, default=1)
            page_size = request.args.get("pageSize", type=int, default=10)
            is_favorite = request.args.get("isFavorite", type=lambda v: v.lower() == 'true' if v else None)
            auto_record = request.args.get("autoRecord", type=lambda v: v.lower() == 'true' if v else None)
            watched = request.args.get("watched", type=lambda v: v.lower() == 'true' if v else None)
            
            filtered_list = data_store["live_list"]
            # print('讀取 live_list', data_store["live_list"])

            if is_favorite is not None:
                filtered_list = [item for item in filtered_list if item["isFavorite"] == is_favorite]
            
            if auto_record is not None:
                filtered_list = [item for item in filtered_list if item["autoRecord"] == auto_record]
            
            if watched is not None:
                filtered_list = [item for item in filtered_list if item["watched"] == watched]
            
            total_records = len(filtered_list)
            total_pages = (total_records + page_size - 1) // page_size  # 計算總頁數
            
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
            return jsonify(response), 200
        finally:    
            print()

    @app.route('/api/recordingcontrol', methods=['POST'])
    def recording_control():
        try:
            data = request.json
            recording_id = data["id"]
            option_type = data["optionType"]

            for item in data_store["live_list"]:
                if item["id"] == recording_id:
                    if option_type == "start":
                        if item["url"] in data_store["online_streams"]:
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Already recording"}), 400
                        
                        try:
                            stream_url, status = get_live_stream_url(item["url"])
                            if status == "Online":
                                filename_template = generate_filename(item["url"])
                                process = multiprocessing.Process(target=record_stream, args=(stream_url, filename_template))
                                process.start()
                                data_store["online_streams"][item["url"]] = process
                                return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording started"}), 200
                            else:
                                return jsonify({"id": recording_id, "optionType": option_type, "status": "Stream offline"}), 400
                        except Exception as e:
                            return jsonify({"id": recording_id, "optionType": option_type, "status": f"Error starting recording: {str(e)}"}), 500

                    elif option_type == "stop":
                        if item["url"] in data_store["online_streams"]:
                            process = data_store["online_streams"][item["url"]]
                            process.terminate()
                            process.join()
                            del data_store["online_streams"][item["url"]]
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording stopped"}), 200
                        else:
                            return jsonify({"id": recording_id, "optionType": option_type, "status": "Recording not found"}), 404
            return jsonify({"id": recording_id, "optionType": option_type, "status": "ID not found"}), 404
        finally:    
            print()

from flask import request, jsonify
from utils.error_handling import handle_errors
from services.data_service import filter_items, update_item_status, add_new_item
from services.recording_service import start_recording, stop_recording
from db.operations import get_live_stream_by_url_or_name, delete_live_stream, get_all_live_streams, get_live_stream_by_id, update_live_stream
from datetime import datetime

def setup_routes(app, data_store, data_lock):

    @app.route('/api/queryandaddlist', methods=['POST'])
    @handle_errors
    def query_and_add_list():
        data = request.json
        url_or_name_or_id = data.get('urlOrNameOrId').strip()
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with data_lock:
            data_store["search_history"].append({url_or_name_or_id, current_time})

        if not url_or_name_or_id:
            return jsonify({"message": "未提供網址或名稱或ID"}), 400

        existing_item = get_live_stream_by_url_or_name(url_or_name_or_id)
        if existing_item:
            updated_item = update_item_status(existing_item, data_store, data_lock)
            return jsonify(updated_item.__dict__), 200
        else:
            new_item = add_new_item(url_or_name_or_id, data_store, data_lock)
            if new_item:
                with data_lock:
                    data_store["live_list"].append(new_item)
                return jsonify(new_item.__dict__), 201

        return jsonify({"message": "未找到頁面"}), 404
    
    @app.route('/api/deletelist', methods=['DELETE'])
    @handle_errors
    def delete_list():
        data = request.json
        url_or_name_or_id = data['urlOrNameOrId']
        success = delete_live_stream(url_or_name_or_id)
        if success:
            return jsonify({"message": "Item deleted"}), 200
        return jsonify({"message": "Item not found"}), 404

    @app.route('/api/updateliststatus', methods=['PUT'])
    @handle_errors
    def update_list_status():
        data = request.json
        url_or_name_or_id = data['urlOrNameOrId']
        item = get_live_stream_by_url_or_name(url_or_name_or_id)
        if item:
            item.isFavorite = data["isFavorite"]
            item.auto_record = data["auto_record"]
            item.viewed = data["viewed"]
            update_live_stream(item)
            return jsonify(item), 200
        return jsonify({"message": "Item not found"}), 404

    @app.route('/api/channels', methods=['GET'])
    @handle_errors
    def get_channels():
        channels = get_all_live_streams()
        auto_record_channels = [channel for channel in channels if channel.auto_record]
        return jsonify(auto_record_channels), 200


    @app.route('/api/getlist', methods=['POST'])
    @handle_errors
    def get_list():
        try:
            data = request.get_json()
            current_page = data.get("currentPage", 1)
            page_size = data.get("pageSize", 10)
            search_query = data.get("searchQuery", "")
            filters = data.get('filters', {})
            sorter = data.get('sorter', {})

            items = get_all_live_streams()
            filtered_list = filter_items(items, filters, search_query, sorter)

            total_records = len(filtered_list)
            total_pages = (total_records + page_size - 1) // page_size
            start = (current_page - 1) * page_size
            end = start + page_size
            paginated_list = filtered_list[start:end]

            response = {
                "channelList": [item.__dict__ for item in paginated_list],  # 將 LiveStream 對象轉換為字典
                "totalCount": total_records,
                "totalPages": total_pages,
                "currentPage": current_page,
                "pageSize": page_size,
                "serverStatus": 'success' if paginated_list else 'false'
            }

            return jsonify(response), 200
        except Exception as e:
            print(f"處理 /api/getlist 請求時發生錯誤: {e}")
            return jsonify({"message": str(e)}), 500

    @app.route('/api/recordingcontrol', methods=['POST'])
    @handle_errors
    def recording_control():
        data = request.json
        recording_id = data["id"]
        option_type = data["optionType"]
        item = get_live_stream_by_id(recording_id)
        if item:
            if option_type == "start":
                return start_recording(item, data_store, data_lock)
            elif option_type == "stop":
                return stop_recording(item, data_store, data_lock)
        return jsonify({"id": recording_id, "optionType": option_type, "status": "ID not found"}), 404

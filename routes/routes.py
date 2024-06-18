from flask import request, jsonify
from utils.error_handling import handle_errors
from services.data_service import process_url_or_name, update_item_status, add_new_item
from services.recording_service import start_recording, stop_recording
from db_operations import get_item_by_url_or_name, delete_item_from_db, get_all_items_from_db, get_item_by_id
from utils.utils import update_data_store_and_file

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

        existing_item = get_item_by_url_or_name(url_or_name_or_id)
        if existing_item:
            updated_item = update_item_status(existing_item, data_store, data_lock)
            return jsonify(updated_item), 200
        else:
            new_item = add_new_item(url_or_name_or_id, data_store, data_lock)
            if new_item:
                update_data_store_and_file(data_store, new_item, data_lock)
                return jsonify(new_item), 201

        return jsonify({"message": "未找到頁面"}), 404

    @app.route('/api/deletelist', methods=['DELETE'])
    @handle_errors
    def delete_list():
        data = request.json
        url_or_name_or_id = data['urlOrNameOrId']
        success = delete_item_from_db(url_or_name_or_id)
        if success:
            return jsonify({"message": "Item deleted"}), 200
        return jsonify({"message": "Item not found"}), 404

    @app.route('/api/updateliststatus', methods=['PUT'])
    @handle_errors
    def update_list_status():
        data = request.json
        url_or_name_or_id = data['urlOrNameOrId']
        item = get_item_by_url_or_name(url_or_name_or_id)
        if item:
            item.is_favorite = data["isFavorite"]
            item.auto_record = data["autoRecord"]
            item.viewed = data["viewed"]
            update_item_in_db(item)
            return jsonify(item), 200
        return jsonify({"message": "Item not found"}), 404

    @app.route('/api/channels', methods=['GET'])
    @handle_errors
    def get_channels():
        channels = get_all_items_from_db()
        auto_record_channels = [channel for channel in channels if channel.auto_record]
        return jsonify(auto_record_channels), 200

    @app.route('/api/getlist', methods=['POST'])
    @handle_errors
    def get_list():
        data = request.get_json()
        current_page = data.get("currentPage", 1)
        page_size = data.get("pageSize", 10)
        search_query = data.get("searchQuery", "")
        filters = data.get('filters', {})
        sorter = data.get('sorter', {})

        items = get_all_items_from_db()
        filtered_list = filter_items(items, filters, search_query, sorter)

        total_records = len(filtered_list)
        total_pages = (total_records + page_size - 1) // page_size
        start = (current_page - 1) * page_size
        end = start + page_size
        paginated_list = filtered_list[start:end]

        response = {
            "channelList": paginated_list,
            "totalCount": total_records,
            "totalPages": total_pages,
            "currentPage": current_page,
            "pageSize": page_size,
            "serverStatus": 'success' if paginated_list else 'false'
        }

        return jsonify(response), 200

    @app.route('/api/recordingcontrol', methods=['POST'])
    @handle_errors
    def recording_control():
        data = request.json
        recording_id = data["id"]
        option_type = data["optionType"]
        item = get_item_by_id(recording_id)
        if item:
            if option_type == "start":
                return start_recording(item, data_store, data_lock)
            elif option_type == "stop":
                return stop_recording(item, data_store, data_lock)
        return jsonify({"id": recording_id, "optionType": option_type, "status": "ID not found"}), 404

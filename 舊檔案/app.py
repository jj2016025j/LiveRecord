from flask import Flask, jsonify, request

app = Flask(__name__)

# 定义 ReservationOptions 类（结构与 JavaScript 中的对象类似）
class ReservationOptions:
    def __init__(self, name, url, preview_image, status, size, viewers, viewed):
        self.name = name
        self.url = url
        self.previewImage = preview_image
        self.status = status
        self.size = size
        self.viewers = viewers
        self.viewed = viewed

# 定义数据生成函数
def generate_reservations(total_count=5):
    data = { }
    
    for _ in range(total_count):
        reservation = ReservationOptions(
            id=1,
            name='陳家洛',
            url='https://chatgpt.com/c/86659176-8e10-4c42-aa11-7ce5d7a01fe5',
            preview_image='logo', 
            status='CustomerBuy', 
            size=[720, 1080],
            viewers=1000,
            viewed=False
        )
        data.channelList.append(reservation.__dict__) 
    return data

data_store = {
    "list": [],
    "recording_status": {}
}

@app.route('/api/queryandaddlist', methods=['POST'])
def query_and_add_list():
    url_or_name = request.args.get('urlOrName')
    new_item = {
        "id": len(data_store["list"]) + 1,
        "urlOrName": url_or_name,
        "isFavorite": False,
        "autoRecord": False,
        "viewed": False
    }
    data_store["list"].append(new_item)
    reservations = generate_reservations(1)

    return jsonify(reservations[0]), 201

@app.route('/api/deletelist', methods=['DELETE'])
def delete_list():
    url_or_name = request.args.get('urlOrName')
    data_store["list"] = [item for item in data_store["list"] if item["urlOrName"] != url_or_name]
    return jsonify({"message": "Item deleted"}), 200

@app.route('/api/updateliststatus', methods=['PUT'])
def update_list_status():
    data = request.json
    for item in data_store["list"]:
        if item["id"] == data["id"]:
            item["isFavorite"] = data["isFavorite"]
            item["autoRecord"] = data["autoRecord"]
            item["viewed"] = data["viewed"]
            return jsonify(item), 200
    return jsonify({"message": "Item not found"}), 404

@app.route('/api/getlist', methods=['POST'])
def get_list():
    data = request.json
    current_page = data.get("currentPage", 1)
    page_size = data.get("pageSize", 10)
    start = (current_page - 1) * page_size
    end = start + page_size
    paginated_list = data_store["list"][start:end]
    return jsonify(paginated_list), 200

@app.route('/api/getlist', methods=['GET'])
def history_endpoint():
    total_count = 5 
    
    # data = request.json
    # current_page = data.get("currentPage", 1)
    # page_size = data.get("pageSize", 10)
    # start = (current_page - 1) * page_size
    # end = start + page_size
    # paginated_list = data_store["list"][start:end]
    # print('Paginated List:', paginated_list) 
    
    reservations = generate_reservations(total_count)
    return jsonify(reservations)

@app.route('/api/recordingoption', methods=['POST'])
def recording_option():
    data = request.json
    recording_id = data["id"]
    option_type = data["optionType"]
    data_store["recording_status"][recording_id] = option_type
    return jsonify({"id": recording_id, "optionType": option_type}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555)

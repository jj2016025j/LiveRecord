from datetime import datetime
import json
import os
from get_live_stream_url import get_live_stream_url
from recording import capture_preview_image
from utils import extract_name_from_url, generate_unique_id

# 從環境變數中讀取檔案路徑
FILE_PATH = os.getenv('FILE_PATH', r'D:\01照片分類\moniturbate')
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')
PREVIEW_IMAGE_DIR = os.getenv('PREVIEW_IMAGE_DIR', r'src\assets')

# 提取直播流
def extract_live_streams(json_data):
    print("提取直播流URL")
    return [item['url'] for item in json_data.get('live_list', [])]

# 從名稱生成URL
def generate_url_from_name(name):
    if name and name != 'unknown':
        return f"https://chaturbate.com/{name}/"
    return ''

# 讀取JSON檔案
def read_json_file(file_path=JSON_FILE_PATH):
    """
    讀取 JSON 文件並返回數據。
    """
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        print(f"檔案不存在或為空：{file_path}")
        return {}
    print(f"讀取JSON檔案：{file_path}")
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            # print(f"取得資料：{data}")
        return data
    except json.JSONDecodeError as e:
        print(f"讀取JSON檔案時出錯：{e}")
        return {}
    
# 將 data_store 寫入文件的函數
def write_json_file(data_store):
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as file:
            data_dict = dict(data_store)
            # 如果 data 是 DictProxy 對象，先將其轉換為普通字典
            if isinstance(data_store, dict):
                data_dict = data_store.copy()
            else:
                data_dict = dict(data_store)
            # if data_dict['live_stream_url'] and not data_dict['preview_image']:
            #     data_dict['preview_image'] = capture_preview_image(data_dict['live_stream_url'], PREVIEW_IMAGE_DIR)
            # for item in data_dict.get('live_list', []):
            #     # 確保 live_stream_url 和 preview_image 鍵存在
            #     item.setdefault('live_stream_url', None)
            #     item.setdefault('preview_image', None)
            #     if item['live_stream_url'] and not item['preview_image']:
            #         item['preview_image'] = capture_preview_image(item['live_stream_url'], PREVIEW_IMAGE_DIR)
            # if data_dict['live_stream_url']:
            #     data_dict['preview_image'] = capture_preview_image(data_dict['live_stream_url'], PREVIEW_IMAGE_DIR)
            if not data_dict or data_dict == {}:
                return
            json.dump(data_dict, file, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"寫入 JSON 文件時發生錯誤: {e}")
        raise

def update_data_store_and_file(data_store, new_item):
    data_store["live_list"].append(new_item)
    write_json_file(data_store)
    
# 檢查並補全資料
def check_and_complete_data(item):
    # 確保有 'id' 鍵
    item.setdefault('id', generate_unique_id())

    # 確保有 'name' 鍵
    if 'url' in item and (not item.get('name') or item['name'] == 'unknown'):
        item['name'] = extract_name_from_url(item['url'])

    # 確保有 'url' 鍵
    if 'name' in item and not item.get('url'):
        item['url'] = generate_url_from_name(item['name'])

    # 刪除不需要的 'name' 鍵
    if item.get('name') == 'unknown':
        del item['name']

    # 刪除不需要的 'url' 鍵
    if item.get('url') == "https://chaturbate.com/unknown/":
        del item['url']

    # 確保有 'status' 鍵
    item.setdefault('status', "offline")

    # 確保有 'isFavorite' 鍵
    item.setdefault('isFavorite', False)

    # 確保有 'autoRecord' 鍵
    item.setdefault('autoRecord', False)

    # 確保有 'viewed' 鍵
    item.setdefault('viewed', False)

    # 確保有 'live_stream_url' 鍵，並補全 'status'
    if not item.get('live_stream_url') and item.get('url'):
        item['live_stream_url'], status = get_live_stream_url(item['url'])
        item['status'] = status
    return item

# 整理JSON檔案 清理重複資料
def organize_json_file(data_store, file_path=JSON_FILE_PATH):
    print(f"整理JSON檔案：{file_path}")
    data = read_json_file(file_path)
    if "live_list" in data:
        for i in range(len(data["live_list"])):
            data["live_list"][i] = check_and_complete_data(data["live_list"][i])
        data_store["live_list"] = data["live_list"]
    else:
        print("JSON資料中不存在 'live_list' 鍵")
    write_json_file(data, file_path)
    print("JSON 文件整理完畢...")

def initialize_data_store(data_store):
    """
    初始化直播流列表資料。
    """
    try:
        JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')
        
        if not os.path.exists(JSON_FILE_PATH):
            raise FileNotFoundError(f"{JSON_FILE_PATH} 文件不存在。")

        json_data = read_json_file(JSON_FILE_PATH)
        
        if not isinstance(json_data, dict) or 'live_list' not in json_data:
            raise ValueError("JSON 文件格式錯誤或缺少 'live_list' 鍵。")
        
        live_list = json_data.get('live_list', [])
        
        if not isinstance(live_list, list):
            raise ValueError("'live_list' 應該是一個列表。")
        
        data_store["live_list"] = live_list
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} 初始化完成")
        
        return json_data
    except FileNotFoundError as e:
        print(f"錯誤: {e}")
    except ValueError as e:
        print(f"錯誤: {e}")
    except KeyboardInterrupt:
        print("初始化進程被中斷")
    except Exception as e:
        print(f"初始化過程中發生未知錯誤: {e}")

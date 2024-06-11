from datetime import datetime
import json
import re
import uuid
import os

from get_live_stream_url import get_live_stream_url

# 從環境變數中讀取檔案路徑
FILE_PATH = os.getenv('FILE_PATH', r'D:\01照片分類\moniturbate')
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')

# 生成唯一ID的函數
def generate_unique_id():
    return str(uuid.uuid4())

# 從URL中提取名稱
def extract_name_from_url(url):
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    if match:
        return match.group(1)
    return ''

# 從名稱生成URL
def generate_url_from_name(name):
    if name and name != 'unknown':
        return f"https://chaturbate.com/{name}/"
    return ''

# 生成檔案名稱及路徑，如果同名則更改名稱
def generate_filename(url):
    fixed_path = FILE_PATH
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    file_name = 'unknown'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{fixed_path}\\{file_name}_{timestamp}.ts"

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
    
# 寫入JSON檔案
def write_json_file(data_store, file_path=JSON_FILE_PATH):
    data = dict(data_store)  # 將 DictProxy 轉換為普通字典
    print(f"寫入JSON檔案：{file_path}")
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

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

# 整理JSON檔案
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


# 提取直播流
def extract_live_streams(json_data):
    print("提取直播流URL")
    return [item['url'] for item in json_data.get('live_list', [])]

# 從URL中提取名稱
def extract_name_from_url(url):
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None

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

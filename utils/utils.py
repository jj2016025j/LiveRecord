import os
import re
from datetime import datetime
import uuid

FILE_PATH = os.getenv('FILE_PATH', r'D:\01照片分類\moniturbate')

# 生成唯一ID的函數
def generate_unique_id():
    return str(uuid.uuid4())

def get_live_streams_list(data_store):
    """
    從 data_store 取得 autoRecord 列表，
    然後從 live_list 中找到符合的 ID，放進陣列回傳。
    """
    autoRecord_list = data_store.get('autoRecord', [])
    live_list = data_store.get('live_list', [])

    # 從 live_list 中找到符合 autoRecord_list 的項目
    matching_items = [item for item in live_list if item['id'] in autoRecord_list]

    return matching_items

def get_live_list(json_data):
    print("提取live_list")
    live_list = json_data.get('live_list', [])
    return extract_live_streams(live_list)

def extract_live_streams(live_list):
    print("提取直播流URL")
    return [item['url'] for item in live_list]

def extract_name_from_url2(url):
    # 從 URL 中提取名稱的邏輯
    return url.split('/')[-2] if url.endswith('/') else url.split('/')[-1]

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

# 從URL中提取名稱
def extract_name_from_steam_url(url):
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None

# 生成檔案名稱及路徑，如果同名則更改名稱
def generate_filename(url, fixed_path = FILE_PATH):
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    file_name = 'unknown'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{fixed_path}\\{file_name}_{timestamp}.ts"

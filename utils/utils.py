import os
import re
from datetime import datetime
import uuid

FILE_PATH = os.getenv('FILE_PATH', r'/Users/leechiensheng/Movies')

def generate_unique_id():
    """
    生成唯一ID的函數
    """
    return str(uuid.uuid4())

def get_live_streams_list(data_store, data_lock):
    """
    從 data_store 取得 autoRecord 列表，
    然後從 live_list 中找到符合的 ID，放進陣列回傳。
    """
    print("從 data_store 取得 autoRecord 列表並篩選匹配的 live_list")
    
    with data_lock:
        autoRecord_list = data_store.get('autoRecord', [])
        live_list = data_store.get('live_list', [])

    matching_items = [item for item in live_list if item['id'] in autoRecord_list]
    return matching_items

def get_live_list(json_data):
    """
    提取 live_list
    """
    print("提取 live_list")
    live_list = json_data.get('live_list', [])
    return extract_live_streams(live_list)

def extract_live_streams(live_list):
    """
    提取直播流 URL
    """
    print("提取直播流 URL")
    return [item['url'] for item in live_list]

# def extract_name_from_url(url):
#     """
#     從 URL 中提取名稱
#     """
#     match = re.search(r'([^\/]+)\/$', url) if url.endswith('/') else re.search(r'([^\/]+)$', url)
#     if match:
#         return match.group(1)
#     return 'unknown'

def extract_name_from_url(url):
    """
    從 URL 中提取名稱
    """
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    if match:
        return match.group(1)
    return ''

# def generate_url_from_name(name, base_url):
#     """
#     從名稱生成 URL
#     """
#     if name and name != 'unknown':
#         return f"{base_url}/{name}/"
#     return ''

def generate_url_from_name(name):
    """
    從名稱生成 URL
    """
    if name and name != 'unknown':
        return f"https://chaturbate.com/{name}/"
    return ''

def extract_name_from_stream_url(url):
    """
    從直播流 URL 中提取名稱
    """
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None

# def generate_filename(url, fixed_path=FILE_PATH):
#     """
#     生成檔案名稱及路徑，如果同名則更改名稱
#     """
#     print(f"生成檔案名稱及路徑: {url}")
#     file_name = extract_name_from_url(url)
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     return f"{fixed_path}\\{file_name}_{timestamp}.ts"

def generate_filename(url, fixed_path=FILE_PATH):
    """
    生成檔案名稱及路徑，如果同名則更改名稱
    """
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    file_name = 'unknown'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return os.path.join(fixed_path, f"{file_name}_{timestamp}.ts")

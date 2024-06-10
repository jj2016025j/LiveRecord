from datetime import datetime
import json
import re
import requests
from bs4 import BeautifulSoup
import uuid
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup

JSON_FILE_PATH = 'live_list.json'

data_store = {
    "live_list": [],
    "recording_status": {},
    "favorites": [],
    "auto_record": [],
    "online_streams": {},
    "offline_streams": []
}

# 生成唯一ID的函数
def generate_unique_id():
    return str(uuid.uuid4())

# 从URL中提取名称
def extract_name_from_url(url):
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    if match:
        return match.group(1)
    return ''

# 从名称生成URL
def generate_url_from_name(name):
    if name and name != 'unknown':
        return f"https://chaturbate.com/{name}/"
    return ''

# 生成檔案名稱及路徑
# 要加上如果同名則更改名稱
def generate_filename(url):
    fixed_path = r"D:\01照片分類\moniturbate"
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    file_name = 'unknown'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{fixed_path}\\{file_name}_{timestamp}.ts"

# 讀取檔案
def read_json_file(file_path = JSON_FILE_PATH):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# 複寫檔案
def write_json_file(data = {}, file_path = JSON_FILE_PATH ):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# 檢查並補全資料
def check_and_complete_data(item):
    # 确保有 'id' 键
    item.setdefault('id', generate_unique_id())

    # 确保有 'name' 键
    if 'url' in item and (not item.get('name') or item['name'] == 'unknown'):
        item['name'] = extract_name_from_url(item['url'])

    # 确保有 'url' 键
    if 'name' in item and not item.get('url'):
        item['url'] = generate_url_from_name(item['name'])

    # 删除不需要的 'name' 键
    if item.get('name') == 'unknown':
        del item['name']

    # 删除不需要的 'url' 键
    if item.get('url') == "https://chaturbate.com/unknown/":
        del item['url']

    # 确保有 'status' 键
    item.setdefault('status', "Offline")

    # 确保有 'isFavorite' 键
    item.setdefault('isFavorite', False)

    # 确保有 'autoRecord' 键
    item.setdefault('autoRecord', False)

    # 确保有 'viewed' 键
    item.setdefault('viewed', False)

    # 确保有 'live_stream_url' 键，并补全 'status'
    if not item.get('live_stream_url') and item.get('url'):
        item['live_stream_url'], status = get_live_stream_url(item['url'])
        item['status'] = status
    return item

# 整理檔案
def organize_json_file(file_path=JSON_FILE_PATH):
    data = read_json_file(file_path)
    if "live_list" in data:
        for i in range(len(data["live_list"])):
            data["live_list"][i] = check_and_complete_data(data["live_list"][i])
    else:
        data["live_list"] = []

    write_json_file(data, file_path)

def extract_live_streams(json_data):
    return [item['url'] for item in json_data.get('live_list', [])]
        
# 直播流中提取名稱
def extract_name_from_url(url):
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None

# 取得直播流
def get_live_stream_url(page_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }

    # 配置重試策略
    session = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
    session.mount('https://', HTTPAdapter(max_retries=retries))

    try:
        response = session.get(page_url, headers=headers, timeout=10)

        if response.status_code == 404:
            return None, "Page not found"

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            for script in soup.find_all('script'):
                if '.m3u8' in script.text:
                    start = script.text.find('https://')
                    end = script.text.find('.m3u8') + 5
                    stream_url = script.text[start:end]
                    stream_url = stream_url.encode('utf-8').decode('unicode-escape')
                    return stream_url, "Online"

        return None, "Offline"

    except requests.exceptions.SSLError as e:
        print(f"SSL error occurred while checking {page_url}: {e}")
        return None, "SSL Error"

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error occurred while checking {page_url}: {e}")
        return None, "Connection Error"

    except requests.exceptions.RequestException as e:
        print(f"Error occurred while checking {page_url}: {e}")
        return None, "Request Error"

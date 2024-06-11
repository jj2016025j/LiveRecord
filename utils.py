import os
import re
from datetime import datetime
import uuid

FILE_PATH = os.getenv('FILE_PATH', r'D:\01照片分類\moniturbate')

# 從URL中提取名稱
def extract_name_from_url(url):
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    if match:
        return match.group(1)
    return ''

# 生成唯一ID的函數
def generate_unique_id():
    return str(uuid.uuid4())

# 生成檔案名稱及路徑，如果同名則更改名稱
def generate_filename(url, fixed_path = FILE_PATH):
    match = re.search(r'chaturbate\.com\/([^\/]+)\/', url)
    file_name = 'unknown'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{fixed_path}\\{file_name}_{timestamp}.ts"

# 從URL中提取名稱
def extract_name_from_steam_url(url):
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None

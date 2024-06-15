from datetime import datetime
import os
from utils.utils import extract_name_from_url, generate_unique_id, generate_url_from_name
from recording.get_live_stream_url import get_live_stream_url
from recording.recording import capture_preview_image

PREVIEW_IMAGE_DIR = os.getenv('PREVIEW_IMAGE_DIR', r'src\assets')

# 初始化流水號
serial_number_counter = 1

def check_and_complete_data(item):
    
    global serial_number_counter
    item.setdefault('id', generate_unique_id())
    if 'url' in item and (not item.get('name') or item['name'] == 'unknown'):
        item['name'] = extract_name_from_url(item['url'])
    if 'name' in item and not item.get('url'):
        item['url'] = generate_url_from_name(item['name'])
    if item.get('name') == 'unknown':
        del item['name']
    if item.get('url') == "https://chaturbate.com/unknown/":
        del item['url']
        
    item.setdefault('status', "offline")
    item.setdefault('isFavorite', False)
    item.setdefault('autoRecord', False)
    item.setdefault('viewed', False)
    
    # if not item.get('live_stream_url') and item.get('url'):
    #     print(item['url'])
    #     item['live_stream_url'], item['status'] = get_live_stream_url(item['url'])
    # if item.get('live_stream_url') and not item.get('preview_image'):
    #     print(item['live_stream_url'])
    #     item['preview_image'] = capture_preview_image(item['live_stream_url'], 'preview_images')
    item.setdefault('createTime', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    item.setdefault('lastViewTime', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    # 增加流水號
    item.setdefault('serial_number', serial_number_counter)
    serial_number_counter += 1
    
    return item

def process_url_or_name(data_store, url, name=None):
    if not url:
        raise ValueError("URL 不能為空")
    
    live_stream_url, status = get_live_stream_url(url)
    print(f"嘗試取得直播流：{live_stream_url}，狀態:{status}")
    preview_image_path = ''  # 赋予默认值
    if status in ["online", "offline"]:
        new_id = generate_unique_id()
        if live_stream_url:
            preview_image_path = capture_preview_image(live_stream_url, PREVIEW_IMAGE_DIR)
            print(f'取得圖片路徑{preview_image_path}')
        
        # 获取当前 live_list 长度作为流水号
        serial_number = len(data_store["live_list"]) + 1
        
        return {
            "id": new_id,
            "name": name or url.split('/')[-2],
            "url": url,
            "status": status,
            "isFavorite": False,
            "autoRecord": True,
            "viewed": False,
            "live_stream_url": live_stream_url,
            "preview_image": preview_image_path,
            "createTime": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "lastViewTime": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "serial_number": serial_number
        }
    return None

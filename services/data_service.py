from db.operations import add_live_stream, update_live_stream
from recording.get_live_stream_url import repeat_get_live_stream_url
from recording.recording import capture_preview_image, start_recording_process
from models.live_stream import LiveStream
import multiprocessing
import os
from utils.utils import generate_filename, generate_unique_id

PREVIEW_IMAGE_DIR = os.getenv('PREVIEW_IMAGE_DIR', r'src\assets')

def process_url_or_name(data_store, data_lock, url_or_name):
    """
    處理 URL 或名稱以創建新的直播流資料
    """
    live_stream_url, status = repeat_get_live_stream_url(url_or_name)
    new_id = generate_unique_id()
    new_item = LiveStream(
        id=new_id,
        name=url_or_name,
        url=url_or_name,
        status=status,
        live_stream_url=live_stream_url
    )
    if live_stream_url and status == 'online':
        preview_image_path = capture_preview_image(live_stream_url, PREVIEW_IMAGE_DIR)
        new_item.preview_image = preview_image_path
    print("新增直播流資料:", new_item.__dict__)
    add_live_stream(new_item)
    return new_item

def update_item_status(existing_item, data_store, data_lock):
    """
    更新現有直播流的狀態
    """
    live_stream_url, status = repeat_get_live_stream_url(existing_item.url)
    existing_item.live_stream_url = live_stream_url
    existing_item.status = status
    if live_stream_url and status == 'online':
        preview_image_path = capture_preview_image(live_stream_url, PREVIEW_IMAGE_DIR)
        existing_item.preview_image = preview_image_path
        filename_template = generate_filename(existing_item.url)
        process = multiprocessing.Process(target=start_recording_process, args=(live_stream_url, filename_template, data_store, data_lock, existing_item.url))                   
        process.start()
    print("更新直播流資料:", existing_item.__dict__)
    update_live_stream(existing_item)
    return existing_item

def add_new_item(url_or_name, data_store, data_lock):
    """
    新增新的直播流資料
    """
    new_item = process_url_or_name(data_store, data_lock, url_or_name)
    return new_item

def filter_items(items, filters, search_query, sorter):
    filtered_list = items
    if 'autoRecord' in filters and filters['autoRecord']:
        auto_record_filters = filters['autoRecord']
        filtered_list = [
            item for item in filtered_list 
            if ('true' in auto_record_filters and item.autoRecord) or 
            ('false' in auto_record_filters and not item.autoRecord)
        ]

    if 'preview_image' in filters and filters['preview_image']:
        preview_image_filters = filters['preview_image']
        filtered_list = [
            item for item in filtered_list 
            if ('haveImage' in preview_image_filters and item.preview_image) or 
            ('noImage' in preview_image_filters and not item.preview_image)
        ]

    if 'status' in filters and filters['status']:
        status_filters = filters['status']
        filtered_list = [
            item for item in filtered_list 
            if item.status in status_filters
        ]

    if search_query:
        search_query_lower = search_query.lower()
        filtered_list = [
            item for item in filtered_list if (
                (item.id and search_query_lower in item.id.lower()) or
                (item.name and search_query_lower in item.name.lower()) or
                (item.url and search_query_lower in item.url.lower()) or
                (item.live_stream_url and search_query_lower in item.live_stream_url.lower()) or
                (item.status and search_query_lower in item.status.lower())
            )
        ]

    if 'field' in sorter and 'order' in sorter:
        sorter_key = sorter['field']
        sorter_order = sorter['order']
        reverse = sorter_order == 'descend'
        if sorter_key in ["id", "name", "url"]:
            filtered_list = sorted(filtered_list, key=lambda x: getattr(x, sorter_key), reverse=reverse)

    return filtered_list
from recording.get_live_stream_url import repeat_get_live_stream_url
from recording.recording import capture_preview_image, record_stream
from db_operations import add_item_to_db, update_item_in_db
from utils.utils import generate_filename
from models import LiveStream
import multiprocessing

def process_url_or_name(data_store, data_lock, url_or_name):
    live_stream_url, status = repeat_get_live_stream_url(url_or_name)
    new_item = LiveStream(
        name=url_or_name,
        url=url_or_name,
        status=status,
        live_stream_url=live_stream_url
    )
    if live_stream_url and status == 'online':
        preview_image_path = capture_preview_image(live_stream_url, 'preview_images')
        new_item.preview_image = preview_image_path
    add_item_to_db(new_item)
    return new_item

def update_item_status(existing_item, data_store, data_lock):
    live_stream_url, status = repeat_get_live_stream_url(existing_item.url)
    existing_item.live_stream_url = live_stream_url
    existing_item.status = status
    if live_stream_url and status == 'online':
        preview_image_path = capture_preview_image(live_stream_url, 'preview_images')
        existing_item.preview_image = preview_image_path
        filename_template = generate_filename(existing_item.url)
        process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template, data_store, data_lock, existing_item.url))                   
        process.start()
    update_item_in_db(existing_item)
    return existing_item

def add_new_item(url_or_name, data_store, data_lock):
    new_item = process_url_or_name(data_store, data_lock, url_or_name)
    return new_item

def filter_items(items, filters, search_query, sorter):
    filtered_list = items
    if 'autoRecord' in filters and filters['autoRecord']:
        auto_record_filters = filters['autoRecord']
        filtered_list = [
            item for item in filtered_list 
            if ('true' in auto_record_filters and item.auto_record) or 
            ('false' in auto_record_filters and not item.auto_record)
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
            filtered_list = sorted(filtered_list, key=lambda x: x.get(sorter_key, ''), reverse=reverse)

    return filtered_list

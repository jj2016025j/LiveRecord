import multiprocessing
from flask import jsonify
from recording.recording import start_recording_process, stop_recording_process
from utils.utils import generate_filename

def start_recording(item, data_store, data_lock):
    """
    開始錄製直播流
    """
    live_stream_url = item.live_stream_url
    filename_template = generate_filename(item.url)
    process = multiprocessing.Process(target=start_recording_process, args=(live_stream_url, filename_template, data_store, data_lock, item.url))
    process.start()
    with data_lock:
        data_store["recording_list"].append(item.url)
    return jsonify({"message": "開始錄製"}), 200

def stop_recording(item, data_store, data_lock):
    """
    停止錄製直播流
    """
    live_stream_url = item.live_stream_url
    filename_template = generate_filename(item.url)
    stop_recording_process(live_stream_url, filename_template, data_store, data_lock, item.url)
    with data_lock:
        data_store["recording_list"].remove(item.url)
    return jsonify({"message": "停止錄製"}), 200

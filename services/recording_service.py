from flask import jsonify
from recording.get_live_stream_url import repeat_get_live_stream_url
from recording.recording import record_stream
from utils.utils import generate_filename
import multiprocessing
from utils.logging_setup import error_logger

def start_recording(item, data_store, data_lock):
    if item.url in data_store["online"]:
        return jsonify({"id": item.id, "optionType": "start", "status": "Already recording"}), 400

    try:
        live_stream_url, status = repeat_get_live_stream_url(item.url)
        if status == "online":
            filename_template = generate_filename(item.url, 'videos')
            process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template, data_store, data_lock, item.url))                   
            process.start()
            with data_lock:
                data_store["online"][item.url] = process
            return jsonify({"id": item.id, "optionType": "start", "status": "Recording started"}), 200
        else:
            return jsonify({"id": item.id, "optionType": "start", "status": "Stream offline"}), 400
    except Exception as e:
        error_logger.error(f"開始錄製時出錯：{str(e)}")
        return jsonify({"id": item.id, "optionType": "start", "status": f"Error starting recording: {str(e)}"}), 500

def stop_recording(item, data_store, data_lock):
    with data_lock:
        if item.url in data_store["online"]:
            process = data_store["online"][item.url]
            process.terminate()
            process.join()
            del data_store["online"][item.url]
            return jsonify({"id": item.id, "optionType": "stop", "status": "Recording stopped"}), 200
        else:
            return jsonify({"id": item.id, "optionType": "stop", "status": "Recording not found"}), 404

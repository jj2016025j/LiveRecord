# process_control.py
from datetime import datetime
import os
import time
import multiprocessing
from recording.get_live_stream_url import get_live_stream_url
from recording.recording import capture_preview_image, record_stream
from utils.utils import generate_filename

PREVIEW_IMAGE_DIR = os.getenv('PREVIEW_IMAGE_DIR', r'src\assets')

def check_and_record_stream(url, live_stream_url, status, data_store, data_lock):
    """
    檢查直播流狀態並進行錄製。
    """
    try:
        if not url:
            print("URL為空")
            return

        if status == "online":
            handle_online_stream(url, live_stream_url, data_store, data_lock)
        elif status == "offline":
            handle_offline_stream(url, data_store, data_lock)
        else:
            print(f"無法找到 {url}。")       
                     
    except Exception as e:
        print(f"檢查 {url} 時出錯: {e}")

def handle_online_stream(url, live_stream_url, data_store, data_lock):
    """
    處理在線直播流邏輯
    """
    start_new_process = False
    with data_lock:
        offline_list = data_store["offline"]
        online_list = data_store["online"]
        recording_list = data_store['recording_list']

        if url in offline_list:
            offline_list.remove(url)
        if url not in online_list:
            online_list.append(url)
            start_new_process = True
            data_store["online_processes"][url] = None
        data_store["offline"] = offline_list
        data_store["online"] = online_list

        # 捕捉直播流預覽圖片
        if live_stream_url:
            preview_image_path = capture_preview_image(live_stream_url, PREVIEW_IMAGE_DIR)
            for item in data_store["live_list"]:
                if item.get("url") == url:
                    item["preview_image"] = preview_image_path
                    break
        data_store["online_processes"][url] = None

    if start_new_process:
        filename_template = generate_filename(url)
        process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template))
        process.start()
        with data_lock:
            data_store["online_processes"][url] = process
            recording_list.append(url)
        print(f'開始錄製直播 {url}。更新後線上直播列表:', online_list)
    else:
        print(f'直播 {url} 現已在線。更新後線上直播列表:', online_list)

def handle_offline_stream(url, data_store, data_lock):
    """
    處理離線直播流邏輯
    """
    with data_lock:
        online_list = data_store["online"]
        offline_list = data_store["offline"]
        recording_list = data_store['recording_list']

        if url in recording_list:
            recording_list.remove(url)
        if url in online_list:
            process = data_store["online_processes"].pop(url, None)
            if process:
                process.terminate()
                process.join()
            online_list.remove(url)
        if url not in offline_list:
            offline_list.append(url)
        data_store["online"] = online_list
        data_store["offline"] = offline_list
        data_store["recording_list"] = recording_list

    print(f'直播 {url} 已離線。更新後離線直播列表:', len(data_store['offline']))
 
def log_monitoring_status(data_store, data_lock):
    """
    日誌記錄監控狀態
    """
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f" =================== {current_time} 瀏覽結束，瀏覽結果: =================== ")
    with data_lock:
        recording_list = data_store['recording_list']
        online = data_store['online']
        online_users = data_store['online_users']
        online_users_last_time = data_store['online_users_last_time']
        offline = data_store['offline']
        offline_users = data_store['offline_users']
        offline_users_last_time = data_store['offline_users_last_time']

        online_users_last_time = online_users
        online_users = len(online)
        offline_users_last_time = offline_users
        offline_users = len(offline)

        print(f"{current_time} 錄製中直播: {recording_list}")
        print(f"在線人數變動: {online_users_last_time} => {online_users} ")
        print(f"離線人數變動: {offline_users_last_time} => {offline_users} ")
        if offline_users == offline_users_last_time and online_users == online_users_last_time:
            print(f" =================== {current_time} 無變動 檢查完畢 =================== ")
    print(f" =================== {current_time} =================== ")

def monitor_streams(data_store, data_lock):
    """
    監控直播流狀態。
    """
    try:
        while True:
            print(" =================== 開始瀏覽所有直播... =================== ")
            with data_lock:
                autoRecord_list = data_store['autoRecord']
                recording_list = data_store['recording_list']

            for url in autoRecord_list:
                if url in recording_list:
                    print(f"{url} 正在錄製中，跳過...")
                    continue

                live_stream_url, status = get_live_stream_url(url)
                check_and_record_stream(url, live_stream_url if status == "online" else None, status, data_store, data_lock)

            log_monitoring_status(data_store, data_lock)
            time.sleep(60)

    except KeyboardInterrupt:
        print("監控進程被中斷")
    
def start_monitoring_and_recording(data_store, data_lock):
    """
    開始監測並錄製在線直播。
    """
    with data_lock:
        live_streams_list = data_store['autoRecord']

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f" =================== {current_time} 直播錄製開始初始化 =================== ")

    for url in live_streams_list:
        live_stream_url, status = get_live_stream_url(url)
        check_and_record_stream(url, live_stream_url if status == "online" else None, status, data_store, data_lock)

    print(f" =================== {current_time} 直播錄製初始化結果: =================== ")
    with data_lock:
        if data_store["online"]:
            print(f"{current_time} 在線直播: {data_store['online']}")
        if data_store["offline"]:
            print(f"{current_time} 離線直播: {len(data_store['offline'])}")
        if not (data_store["online"] or data_store["offline"]):
            print(f"{current_time} 無任何自動錄製的直播在線 初始化完畢")
    print(f" =================== {current_time} 初始化直播流完成... =================== ")

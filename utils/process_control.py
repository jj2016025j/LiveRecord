# process_control.py
from datetime import datetime
import os
import time
import multiprocessing
from recording.get_live_stream_url import repeat_get_live_stream_url
from recording.recording import capture_preview_image, record_stream
from utils.utils import extract_name_from_url, generate_filename

PREVIEW_IMAGE_DIR = os.getenv('PREVIEW_IMAGE_DIR', r'src\assets')

def check_and_record_stream(url, live_stream_url, status, data_store, data_lock):
    """
    監聽直播流狀態並進行錄製。
    """
    try:
        if not url:
            print("URL為空")
            return

        with data_lock:
            # 標記處理中的 URL
            recording_list = data_store['recording_list']
            if url in recording_list:
                print(f"{url} 正在處理中，跳過...")
                return
            
        if status == "online":
            handle_online_stream(url, live_stream_url, data_store, data_lock)
        elif status == "offline":
            handle_offline_stream(url, data_store, data_lock)
        else:
            print(f"無法找到 {url}。")       
                                 
    except Exception as e:
        print(f"監聽 {url} 時出錯: {e}")

def handle_online_stream(url, live_stream_url, data_store, data_lock):
    """
    處理在線直播流邏輯
    """
    start_new_process = False
    with data_lock:
        offline_list = data_store["offline"]
        recording_list = data_store['recording_list']
        live_list = data_store["live_list"]
        for live in live_list:
            if live['url'] == url:
                live['status'] = 'offline'

        if url in offline_list:
            offline_list.remove(url)
        if url not in recording_list:
            recording_list.append(url)
            start_new_process = True
        data_store["offline"] = offline_list
        data_store["recording_list"] = recording_list

        # 捕捉直播流預覽圖片
        if live_stream_url:
            preview_image_path = capture_preview_image(live_stream_url, PREVIEW_IMAGE_DIR)

            for item in data_store["live_list"]:
                if item.get("url") == url:
                    # print('1',item["preview_image"])
                    item["preview_image"] = preview_image_path
                    # print('3',item["preview_image"])
                    break

    if start_new_process:
        filename_template = generate_filename(url)
        process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template, data_store, data_lock, url))                   
        process.start()
        if len(recording_list) > 5:
            print(f'開始錄製直播 {url}。更新後線上直播數量: {len(recording_list)}')
        else:
            print(f'開始錄製直播 {url}。更新後線上直播列表:', recording_list)
    else:
        if len(recording_list) > 5:
            print(f'直播 {url} 現已在線。更新後線上直播數量: {len(recording_list)}')
        else:
            print(f'直播 {url} 現已在線。更新後線上直播列表:', recording_list)
            
def handle_offline_stream(url, data_store, data_lock):
    """
    處理離線直播流邏輯
    """
    with data_lock:
        live_list = data_store["live_list"]
        offline_list = data_store["offline"]
        recording_list = data_store['recording_list']

        for live in live_list:
            if live['url'] == url:
                live['status'] = 'offline'
                
        # 如果 URL 已經在離線列表中，則跳過
        if url in offline_list:
            return
        
        if url in recording_list:
            recording_list.remove(url)
        if url not in offline_list:
            offline_list.append(url)
        data_store["recording_list"] = recording_list
        data_store["offline"] = offline_list

    print(f'直播 {extract_name_from_url(url)} 已離線。更新後離線直播列表:', len(data_store['offline']))
 
def log_monitoring_status(data_store, data_lock):
    """
    日誌記錄監聽狀態
    """
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f" =================== {current_time} 監聽結束，監聽結果: =================== ")
    with data_lock:
        recording_list = data_store['recording_list']
        online_users = data_store['online_users']
        online_users_last_time = data_store['online_users_last_time']
        offline = data_store['offline']
        offline_users = data_store['offline_users']
        offline_users_last_time = data_store['offline_users_last_time']

        online_users_last_time = online_users
        online_users = len(recording_list)
        offline_users_last_time = offline_users
        offline_users = len(offline)

        print(f"{current_time} 錄製中直播: {recording_list}")
        print(f"在線人數變動: {online_users_last_time} => {online_users} ")
        print(f"離線人數變動: {offline_users_last_time} => {offline_users} ")
        if offline_users == offline_users_last_time and online_users == online_users_last_time:
            print(f" =================== {current_time} 無變動 監聽完畢 =================== ")
    print(f" =================== {current_time} 監聽結果輸出完畢 =================== ")

def monitor_streams(data_store, data_lock):
    """
    監控直播流狀態。
    """
    i = 0
    try:
        sleep_time = 60
        while True:
            i += 1
            print(f" =================== 第{i}次監聽所有直播... =================== ")
            with data_lock:
                autoRecord_list = data_store['autoRecord']
                recording_list = data_store['recording_list']

            for url in autoRecord_list:
                if url in recording_list:
                    print(f"{url} 正在錄製中，跳過...")
                    continue

                live_stream_url, status = repeat_get_live_stream_url(url)
                check_and_record_stream(url, live_stream_url if status == "online" else None, status, data_store, data_lock)
            
            sleep_time = 60
            print(f" =================== 第{i}次監聽結束，等待{sleep_time}秒... =================== ")
            log_monitoring_status(data_store, data_lock)
            time.sleep(sleep_time)

    except KeyboardInterrupt:
        print("監聽進程被中斷")
    
def start_monitoring_and_recording(data_store, data_lock):
    """
    初始化直播流狀態。
    """
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with data_lock:
        autoRecord = data_store['autoRecord']

    print(f" =================== {current_time} 直播錄製開始初始化，總共 {len(autoRecord)} 筆資料 =================== ")

    for url in autoRecord:
        live_stream_url, status = repeat_get_live_stream_url(url)
        check_and_record_stream(url, live_stream_url if status == "online" else None, status, data_store, data_lock)

    print(f" =================== {current_time} 直播錄製初始化結果: =================== ")
    with data_lock:
        if data_store["recording_list"]:
            print(f"{current_time} 在線直播: {data_store['recording_list']}")
        if data_store["offline"]:
            print(f"{current_time} 離線直播: {len(data_store['offline'])}")
        if not (data_store["recording_list"] or data_store["offline"]):
            print(f"{current_time} 無任何自動錄製的直播在線 初始化完畢")
    print(f" =================== {current_time} 初始化直播流完成... =================== ")

def start_and_monitor_streams(data_store, data_lock):
    """
    初始化直播流狀態，並開始監聽直播流狀態。
    """
    # 初始化直播流狀態
    start_monitoring_and_recording(data_store, data_lock)

    # 開始監聽直播流狀態
    monitor_streams(data_store, data_lock)

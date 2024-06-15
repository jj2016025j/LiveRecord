# process_control.py
from datetime import datetime
import time
import multiprocessing
from recording.get_live_stream_url import get_live_stream_url
from recording.recording import record_stream
from utils.utils import generate_filename

def check_and_record_stream(url, data_store, lock):
    """
    檢查直播流狀態並進行錄製。
    """
    try:
        if not url:
            print("URL為空")
            return

        live_stream_url, status = get_live_stream_url(url)

        with lock:
            if status == "online":
                if url in data_store["offline"]:
                    data_store["offline"].remove(url)
                    data_store["online"].append(url)
                elif url not in data_store["online"]:
                    filename_template = generate_filename(url)
                    process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template))
                    process.start()
                    data_store["online"].append(url)
                    data_store["online_processes"][url] = process

            elif status == "offline":
                if url in data_store["online"]:
                    process = data_store["online_processes"].pop(url, None)
                    if process:
                        process.terminate()
                        process.join()
                    data_store["online"].remove(url)
                if url not in data_store["offline"]:
                    data_store["offline"].append(url)
            else:
                print(f"無法找到 {url}。")
    except Exception as e:
        print(f"檢查 {url} 時出錯: {e}")
        with lock:
            if url not in data_store["offline"]:
                data_store["offline"].append(url)

def monitor_streams(data_store, lock):
    """
    監控直播流狀態。
    """
    try:
        online_users_last_time = 0
        offline_users_last_time = 0
        online_users = 0
        offline_users = 0
        while True:
            time.sleep(60)
            processes = []

            online_list = data_store.get('online', [])
            offline_list = data_store.get('offline', [])
            
            print("正在檢查直播...")
            for url in offline_list.copy():
                p = multiprocessing.Process(target=check_and_record_stream, args=(url, data_store, lock))
                p.start()
                processes.append(p)

            for p in processes:
                p.join()  # 等待所有子進程完成

            processes.clear()

            with lock:
                for url in online_list:
                    p = multiprocessing.Process(target=check_and_record_stream, args=(url, data_store, lock))
                    p.start()
                    processes.append(p)

            for p in processes:
                p.join()  # 等待所有子進程完成

            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"{current_time} 偵測結果:")
            if data_store["online"]:
                online_users_last_time = online_users
                online_users = len(data_store['online'])
                print(f"{current_time} 在線用戶: {data_store['online']}")
            if data_store["offline"]:
                offline_users_last_time = offline_users
                offline_users = len(data_store['offline'])
                print(f"{current_time} 離線人數: {len(data_store['offline'])}")
            if offline_users != offline_users_last_time:
                print(f"離線人數變動: {offline_users_last_time} => {offline_users} ")
            elif online_users != online_users_last_time:
                print(f"在線人數變動: {online_users_last_time} => {online_users} ")
            else:
                print(f"{current_time} 無變動 檢查完畢")
                
    except KeyboardInterrupt:
        print("監控進程被中斷")

def start_monitoring_and_recording(data_store, lock):
    """
    開始監測並錄製在線直播。
    """
    live_streams_list = data_store['autoRecord']

    data_store["online"] = []
    data_store["offline"] = []
    data_store["online_processes"] = {}
    processes = []

    for url in live_streams_list:
        p = multiprocessing.Process(target=check_and_record_stream, args=(url, data_store, lock))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()  # 等待所有子進程完成

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"{current_time} 初始化結果:")
    if data_store["online"]:
        print(f"{current_time} 在線直播: {data_store['online']}")
    if data_store["offline"]:
        print(f"{current_time} 離線直播: {len(data_store['offline'])}")
    if not (data_store["online"] or data_store["offline"]):
        print(f"{current_time} 無任何自動錄製的直播在線 初始化完畢")
    print(f"{current_time} 初始化直播流完成...")

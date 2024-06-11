# process_control.py
from datetime import datetime
import time
import multiprocessing
from data_store import extract_live_streams, get_live_stream_url
from recording import record_stream
from utils import generate_filename

def check_and_record_stream(page_url, data_store, lock, status_changes):
    """
    檢查直播流狀態並進行錄製。
    """
    try:
        if not page_url:
            print("URL為空")
            return
        live_stream_url, status = get_live_stream_url(page_url)
        with lock:
            if status == "online":
                if page_url in data_store["offline_streams"]:
                    data_store["offline_streams"].remove(page_url)
                    status_changes["online"].append(page_url)
                if page_url not in data_store["online_streams"]:
                    filename_template = generate_filename(page_url)
                    process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template))
                    process.start()
                    data_store["online_streams"][page_url] = process
            elif status == "offline":
                if page_url in data_store["online_streams"]:
                    process = data_store["online_streams"].pop(page_url)
                    process.terminate()
                    process.join()
                    status_changes["offline"].append(page_url)
                if page_url not in data_store["offline_streams"]:
                    data_store["offline_streams"].append(page_url)
            else:
                print(f"無法找到 {page_url}。")
    except KeyboardInterrupt:
        print("進程被中斷")
    except Exception as e:
        print(f"檢查 {page_url} 時出錯: {e}")
        with lock:
            data_store["offline_streams"].append(page_url)

def monitor_streams(data_store, lock):
    """
    監控直播流狀態。
    """
    try:
        while True:
            time.sleep(60)
            status_changes = {"online": [], "offline": []}
            processes = []

            print("正在檢查直播...")
            for page_url in data_store["offline_streams"].copy():
                p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, data_store, lock, status_changes))
                p.start()
                processes.append(p)

            for p in processes:
                p.join()  # 等待所有子進程完成

            processes.clear()

            with lock:
                for page_url in list(data_store["online_streams"]):
                    p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, data_store, lock, status_changes))
                    p.start()
                    processes.append(p)

            for p in processes:
                p.join()  # 等待所有子進程完成

            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"{current_time} 偵測結果:")
            if status_changes["online"]:
                print(f"{current_time} 在線用戶: {status_changes['online']}")
            if status_changes["offline"]:
                print(f"{current_time} 離線人數: {len(status_changes['offline'])}")
            if not (status_changes["online"] or status_changes["offline"]):
                print(f"{current_time} 無變動 檢查完畢")
    except KeyboardInterrupt:
        print("監控進程被中斷")

def start_monitoring_and_recording(data_store, lock):
    """
    開始監測並錄製在線直播。
    """
    streams = extract_live_streams(data_store)

    processes = []
    status_changes = {"online": [], "continuing_online": [], "offline": []}

    for page_url in streams:
        p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, data_store, lock, status_changes))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()  # 等待所有子進程完成

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"{current_time} 初始化結果:")
    if status_changes["online"]:
        print(f"{current_time} 在線直播: {status_changes['online']}")
    if status_changes["offline"]:
        print(f"{current_time} 離線直播: {len(status_changes['offline'])}")
    if not (status_changes["online"] or status_changes["continuing_online"] or status_changes["offline"]):
        print(f"{current_time} 無變動 初始化完畢")
    print(f"{current_time} 初始化直播流完成...")

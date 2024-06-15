# process_control.py
from datetime import datetime
import time
import multiprocessing
from recording.get_live_stream_url import get_live_stream_url
from recording.recording import record_stream
from utils.utils import generate_filename

def check_and_record_stream(url, live_stream_url, status, data_store, data_lock):
    """
    檢查直播流狀態並進行錄製。
    """
    try:
        if not url:
            print("URL為空")
            return

        if status == "online":
            if url in data_store["offline"]:
                with data_lock:
                    offline_list = data_store["offline"]
                    offline_list.remove(url)
                    data_store["offline"] = offline_list
                    
                    online_list = data_store["online"]
                    online_list.append(url)
                    data_store["online"] = online_list
                    
                    print('線上直播列表:',data_store['online'])
                    print('離線直播列表:',len(data_store['offline']))
            elif url not in data_store["online"]:
                filename_template = generate_filename(url)
                process = multiprocessing.Process(target=record_stream, args=(live_stream_url, filename_template))
                process.start()
                
                with data_lock:
                    online_list = data_store["online"]
                    online_list.append(url)
                    data_store["online"] = online_list
                    
                    data_store["online_processes"][url] = process
                    print('線上直播列表:',data_store['online'])

        elif status == "offline":
            with data_lock:
                if url in data_store["online"]:
                    process = data_store["online_processes"].pop(url, None)
                    if process:
                        process.terminate()
                        process.join()

                    online_list = data_store["online"]
                    online_list.remove(url)
                    data_store["online"] = online_list
                
                    print('線上直播列表:',data_store['online'])
                if url not in data_store["offline"]:
                    with data_lock:
                        offline_list = data_store["offline"]
                        offline_list.append(url)
                        data_store["offline"] = offline_list
                        print('離線直播列表:',len(data_store['offline']))
        else:
            print(f"無法找到 {url}。")
                
    except Exception as e:
        print(f"檢查 {url} 時出錯: {e}")
        with data_lock:
            if url not in data_store["offline"]:
                offline_list = data_store["offline"]
                offline_list.append(url)
                data_store["offline"] = offline_list
                print('發生錯誤，加入離線直播列表:',len(data_store['offline']))


def monitor_streams(data_store, data_lock, initialization_done_event):
    """
    監控直播流狀態。
    """
    try:
        with data_lock:
            data_store['online_users']= 0
            data_store['offline_users']= 0
            data_store['online_users_last_time']= 0
            data_store['offline_users_last_time']= 0
        print(" =================== 偵測 開始等待... =================== ")
        # 等待初始化完成
        initialization_done_event.wait()

        print(" =================== 偵測 等待結束... =================== ")
        while True:
            processes = []

            with data_lock:
                auto_record_set = set(data_store['autoRecord'])
                online_set = set(data_store['online'])
                offline_set = set(data_store['offline'])

            # 計算需要檢查的離線列表
            offline_list = list(auto_record_set - online_set) + list(offline_set)            
            print(" =================== 正在瀏覽離線直播... =================== ")
            # with data_lock:
                # print('離線直播列表:',len(data_store['offline']))
            for url in offline_list.copy():
                # print('離線直播網址:',url)
                live_stream_url, status = get_live_stream_url(url)
                p = multiprocessing.Process(target=check_and_record_stream, args=(url, live_stream_url, status, data_store, data_lock))
                p.start()
                processes.append(p)
                
            print(" =================== 正在瀏覽線上直播... =================== ")
            with data_lock:
                online_list = data_store.get('online', [])
                print('線上直播列表:',data_store['online'])
            for url in online_list:
                with data_lock:
                    if url in data_store["online_processes"]:
                        print(f"{url} 正在錄製中，跳過...")
                        continue
                # print('線上直播網址:',url)
                live_stream_url, status = get_live_stream_url(url)
                p = multiprocessing.Process(target=check_and_record_stream, args=(url, live_stream_url, status, data_store, data_lock))
                p.start()
                processes.append(p)

            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f" =================== {current_time} 瀏覽結果: =================== ")
            with data_lock:
                if data_store["online"]:
                    data_store['online_users_last_time'] = data_store['online_users']
                    data_store['online_users'] = len(data_store['online'])
                    print(f"{current_time} 在線用戶: {data_store['online']}")
                if data_store["offline"]:
                    data_store['offline_users_last_time'] = data_store['offline_users']
                    data_store['offline_users'] = len(data_store['offline'])
                    print(f"{current_time} 離線人數: {len(data_store['offline'])}")
                print(f"離線人數變動: {data_store['offline_users_last_time']} => {data_store['offline_users']} ")
                print(f"在線人數變動: {data_store['online_users_last_time']} => {data_store['online_users']} ")
                if data_store['offline_users'] == data_store['offline_users_last_time'] and data_store['online_users'] == data_store['online_users_last_time']:
                    print(f" =================== {current_time} 無變動 檢查完畢 =================== ")
                            
            # 每次偵測完畢後重新開始計時
            time.sleep(60)
                
    except KeyboardInterrupt:
        print("監控進程被中斷")

def start_monitoring_and_recording(data_store, data_lock, initialization_done_event):
    """
    開始監測並錄製在線直播。
    """
    with data_lock:
        live_streams_list = data_store['autoRecord']

        data_store["online"] = []
        data_store["offline"] = []
        data_store["online_processes"] = {}
    processes = []

    for url in live_streams_list:
        live_stream_url, status = get_live_stream_url(url)
        p = multiprocessing.Process(target=check_and_record_stream, args=(url, live_stream_url, status, data_store, data_lock))
        p.start()
        processes.append(p)

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f" =================== {current_time} 初始化結果: =================== ")
    with data_lock:
        if data_store["online"]:
            print(f"{current_time} 在線直播: {data_store['online']}")
        if data_store["offline"]:
            print(f"{current_time} 離線直播: {len(data_store['offline'])}")
        if not (data_store["online"] or data_store["offline"]):
            print(f"{current_time} 無任何自動錄製的直播在線 初始化完畢")
    print(f" =================== {current_time} 初始化直播流完成... =================== ")

    print(" =================== 設置初始化完成事件 =================== ")
    initialization_done_event.set()


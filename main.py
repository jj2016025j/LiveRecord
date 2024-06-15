from flask import Flask
from routes.routes import setup_routes
from utils.process_control import monitor_streams, start_monitoring_and_recording
import multiprocessing
import signal
import os
import atexit
import warnings
from store.data_store import initialize_data_store, organize_json_file

warnings.filterwarnings("ignore")

app = Flask(__name__)
ORGANIZE = os.getenv('ORGANIZE', 'False').lower() in ('true', '1', 't')

def create_data_store():
    manager = multiprocessing.Manager()
    data_store = manager.dict({
        "live_list": [],
        "recording_status": {},
        "favorites": [],
        "auto_record": [],
        "online": {},
        "offline": [],
        "online_processes": {} 
    })
    return data_store

def initialize_processes(data_store, data_lock, initialization_done_event ):
    processes = {}

    # 整理JSON文件
    if ORGANIZE:
        print(" =================== 開始整理 JSON 文件... =================== ")
        organize_json_file(data_store)

    # 初始化資料
    print(" =================== 開始初始化資料... =================== ")
    initialize_data_store(data_store)
    
    # 初始化直播流狀態
    print(" =================== 正在初始化直播流狀態... =================== ")
    processes['initialize'] = multiprocessing.Process(target=start_monitoring_and_recording, args=(data_store, data_lock, initialization_done_event ))
    processes['initialize'].start()

    # 創建並啟動監控進程
    print(" =================== 正在啟動監控進程... =================== ")
    processes['monitor'] = multiprocessing.Process(target=monitor_streams, args=(data_store, data_lock, initialization_done_event ))
    processes['monitor'].start()

    return processes

def terminate_processes(processes):
    print(" =================== 正在終止進程... =================== ")
    for process in processes.values():
        process.terminate()
        process.join()
    print(" =================== 進程已終止。 =================== ")

def signal_handler(sig, frame, processes):
    terminate_processes(processes)
    os._exit(0)

if __name__ == '__main__':
    
    data_store = create_data_store()

    # 初始化進程同步工具
    data_lock = multiprocessing.Lock()
    initialization_done_event = multiprocessing.Event()

    # 設置路由
    setup_routes(app, data_store, data_lock)

    # 初始化並啟動進程
    processes = initialize_processes(data_store, data_lock, initialization_done_event)

    # 註冊信號處理
    signal.signal(signal.SIGINT, lambda sig, frame: signal_handler(sig, frame, processes))
    signal.signal(signal.SIGTERM, lambda sig, frame: signal_handler(sig, frame, processes))
    atexit.register(lambda: terminate_processes(processes))
    
    try:
        app.run(host='0.0.0.0', port=5555, debug=False)
    finally:
        terminate_processes(processes)

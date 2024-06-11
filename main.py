from flask import Flask
from data_store import organize_json_file
from routes import setup_routes
from recording import initialize_streams, monitor_streams
import multiprocessing
import signal
import os
import atexit

app = Flask(__name__)
ORGANIZE = os.getenv('ORGANIZE', False)

def create_data_store():
    manager = multiprocessing.Manager()
    data_store = manager.dict({
        "live_list": [],
        "recording_status": {},
        "favorites": [],
        "auto_record": [],
        "online_streams": {},
        "offline_streams": []
    })
    return data_store

def initialize_processes(data_store, lock):
    processes = {}

    # 整理JSON文件
    if ORGANIZE:
        print("正在整理 JSON 文件...")
        processes['organize'] = multiprocessing.Process(target=organize_json_file, args=(data_store,))
        processes['organize'].start()

    # 初始化直播流狀態
    print("正在初始化直播流狀態...")
    processes['initialize'] = multiprocessing.Process(target=initialize_streams, args=(data_store, lock,))
    processes['initialize'].start()

    # 創建並啟動監控進程
    print("正在啟動監控進程...")
    processes['monitor'] = multiprocessing.Process(target=monitor_streams, args=(data_store, lock,))
    processes['monitor'].start()

    return processes

def terminate_processes(processes):
    print("正在終止進程...")
    for process in processes.values():
        process.terminate()
        process.join()
    print("進程已終止。")

def signal_handler(sig, frame, processes):
    terminate_processes(processes)
    os._exit(0)

if __name__ == '__main__':
    data_store = create_data_store()

    # 初始化進程同步工具
    lock = multiprocessing.Lock()

    # 設置路由
    setup_routes(app, data_store)

    # 初始化並啟動進程
    processes = initialize_processes(data_store, lock)

    # 註冊信號處理    signal.signal(signal.SIGINT, lambda sig, frame: signal_handler(sig, frame, processes))
    signal.signal(signal.SIGINT, lambda sig, frame: signal_handler(sig, frame, processes))
    signal.signal(signal.SIGTERM, lambda sig, frame: signal_handler(sig, frame, processes))
    atexit.register(lambda: terminate_processes(processes))
    
    try:
        app.run(host='0.0.0.0', port=5555, debug=True)
    finally:
        terminate_processes(processes)
        
"""
通常怎麼設計主控程式的架構?
我的認知是以伺服器當主線
在初始化後 啟動監控 最後啟用伺服器
"""
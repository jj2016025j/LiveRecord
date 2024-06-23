import os
import signal
import multiprocessing
import atexit
import warnings
from flask import Flask
from db.initialize import create_data_store, initialize_data_store, setup_db
from routes.routes import setup_routes
from utils.process_control import start_and_monitor_streams
warnings.filterwarnings("ignore")

app = Flask(__name__)

def initialize_processes(data_store, data_lock):
    """
    初始化進程
    """
    processes = {}

    # 整理和初始化資料
    print(" =================== 開始初始化資料... =================== ")
    initialize_data_store(data_store, data_lock)
    
    print(" =================== 正在初始化並啟動監聽進程... =================== ")
    process = multiprocessing.Process(target=start_and_monitor_streams, args=(data_store, data_lock))
    process.start()
    processes['monitor'] = process
    return processes

def terminate_processes(processes):
    """
    終止所有進程
    """
    print(" =================== 正在終止進程... =================== ")
    for process in processes.values():
        process.terminate()
        process.join()
    print(" =================== 進程已終止。 =================== ")

def signal_handler(sig, frame, processes):
    """
    處理信號並終止進程
    """
    terminate_processes(processes)
    os._exit(0)

def main():    
    data_store, data_lock = create_data_store()

    # 初始化資料庫和資料
    setup_db()
    
    # 設置路由
    setup_routes(app, data_store, data_lock)

    # 初始化並啟動進程
    processes = initialize_processes(data_store, data_lock)
    
    # 註冊信號處理
    signal.signal(signal.SIGINT, lambda sig, frame: signal_handler(sig, frame, processes))
    signal.signal(signal.SIGTERM, lambda sig, frame: signal_handler(sig, frame, processes))
    atexit.register(lambda: terminate_processes(processes))
    
    try:
        app.run(host='0.0.0.0', port=5555, debug=False)
    finally:
        terminate_processes(processes)

if __name__ == '__main__':
    main()
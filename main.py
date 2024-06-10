from flask import Flask
from data_store import organize_json_file
from routes import setup_routes
from recording import initialize_streams, monitor_streams
import multiprocessing
import signal
import os

app = Flask(__name__)
if __name__ == '__main__':

    manager = multiprocessing.Manager()
    data_store = manager.dict({
        "live_list": [],
        "recording_status": {},
        "favorites": [],
        "auto_record": [],
        "online_streams": {},
        "offline_streams": []
    })

    # 初始化進程同步工具
    lock = multiprocessing.Lock()

    setup_routes(app, data_store)
    # app.run(host='0.0.0.0', port=5555, debug=True)

    # 整理JSON文件
    print("Organizing JSON file...")
    organize_process = multiprocessing.Process(target=organize_json_file, args=(data_store,))
    organize_process.start()
    # organize_process.join()

    # 初始化直播流狀態
    print("Initializing streams...")
    initialize_process = multiprocessing.Process(target=initialize_streams, args=(data_store, lock,))
    initialize_process.start()
    # initialize_process.join()

    # 創建並啟動監控進程
    print("Starting monitor process...")
    monitor_process = multiprocessing.Process(target=monitor_streams, args=(data_store, lock,))
    monitor_process.start()

    def signal_handler(sig, frame):
        print("Terminating processes...")
        monitor_process.terminate()
        # monitor_process.join()
        print("Processes terminated.")
        os._exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    try:
        app.run(host='0.0.0.0', port=5555, debug=True)
    finally:
        monitor_process.terminate()
        # monitor_process.join()

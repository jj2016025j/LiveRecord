from flask import Flask
from data_store import organize_json_file
from routes import setup_routes
from recording import initialize_streams, monitor_streams
import multiprocessing
import signal
import os

app = Flask(__name__)
setup_routes(app)

if __name__ == '__main__':
    # 初始化進程同步工具
    lock = multiprocessing.Lock()

    # 整理JSON文件
    print("Organizing JSON file...")
    organize_json_file()

    # 初始化直播流狀態
    print("Initializing streams...")
    initialize_streams(lock)

    # 創建並啟動監控進程
    print("Starting monitor process...")
    monitor_process = multiprocessing.Process(target=monitor_streams, args=(lock,))
    monitor_process.start()

    def signal_handler(sig, frame):
        print("Terminating processes...")
        monitor_process.terminate()
        monitor_process.join()
        print("Processes terminated.")
        os._exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    try:
        app.run(host='0.0.0.0', port=5555, debug=True)
    finally:
        monitor_process.terminate()
        monitor_process.join()

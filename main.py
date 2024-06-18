import os
import signal
import multiprocessing
import atexit
import warnings
from flask import Flask
from routes.routes import setup_routes
from utils.process_control import start_and_monitor_streams
from store.data_store import initialize_data_store, organize_json_file, setup_db
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
warnings.filterwarnings("ignore")

app = Flask(__name__)
ORGANIZE = os.getenv('ORGANIZE', 'False').lower() in ('true', '1', 't')
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql+pymysql://user:password@localhost/dbname')

# Initialize the database connection
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

def create_data_store():
    """
    創建並初始化數據存儲
    """
    manager = multiprocessing.Manager()
    data_store = manager.dict({
        "live_list": [],
        "recording_status": {},
        "favorites": [],
        "auto_record": [],
        "search_history": [],
        "offline": [],
        "recording_list": [],
        "online_processes": {} ,
        "online_users": 0,
        "offline_users": 0,
        "online_users_last_time": 0,
        "offline_users_last_time": 0,
    })
    return data_store

def initialize_processes(data_store, db_session):
    """
    初始化進程
    """
    processes = {}

    # 整理和初始化資料
    print(" =================== 開始初始化資料... =================== ")
    initialize_data_store(data_store, db_session)
    
    print(" =================== 正在初始化並啟動監聽進程... =================== ")
    process = multiprocessing.Process(target=start_and_monitor_streams, args=(data_store, db_session))
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

if __name__ == '__main__':
    
    data_store = create_data_store()

    # 初始化資料庫和資料
    setup_db(engine)
    
    # 設置路由
    setup_routes(app, data_store, db_session)

    # 初始化並啟動進程
    processes = initialize_processes(data_store, db_session)

    # 註冊信號處理
    signal.signal(signal.SIGINT, lambda sig, frame: signal_handler(sig, frame, processes))
    signal.signal(signal.SIGTERM, lambda sig, frame: signal_handler(sig, frame, processes))
    atexit.register(lambda: terminate_processes(processes))
    
    try:
        app.run(host='0.0.0.0', port=5555, debug=False)
    finally:
        terminate_processes(processes)

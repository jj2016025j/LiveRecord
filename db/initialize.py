from datetime import datetime
import multiprocessing

from db.operations import get_all_live_streams
from .connection import get_db_connection
import os
import mysql.connector
from mysql.connector import errorcode

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
        "online_processes": {},
        "online_users": 0,
        "offline_users": 0,
        "online_users_last_time": 0,
        "offline_users_last_time": 0,
    })
    data_lock = manager.Lock()
    return data_store, data_lock

def initialize_data_store(data_store, data_lock):
    """
    初始化直播流列表資料
    """
    try:
        live_list = get_all_live_streams()
        auto_record = [item.url for item in live_list if item.auto_record]
        favorites = [item.id for item in live_list if item.isFavorite]

        with data_lock:
            data_store["live_list"] = live_list
            data_store["online"] = []
            data_store["offline"] = []
            data_store["auto_record"] = auto_record
            data_store["favorites"] = favorites

        now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f" =================== {now_time} 資料初始化完成 =================== ")

    except Exception as e:
        print(f"初始化資料庫時發生錯誤: {e}")
                
def setup_db():
    """
    初始化資料庫和資料表
    """
    initialize_database()
    initialize_tables()
    
def initialize_database():
    """
    初始化資料庫，如果不存在則創建
    """
    try:
        conn = get_db_connection(with_database=False)
        if conn:
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {os.getenv('MYSQL_DATABASE', 'livestream_db')}")
            cursor.close()
            conn.close()
            print("資料庫 livestream_db 初始化成功")
    except mysql.connector.Error as err:
        print(f"錯誤: {err}")

def initialize_tables():
    """
    初始化資料表，如果不存在則創建
    """
    tables = {
        'live_list': (
            "CREATE TABLE IF NOT EXISTS live_list ("
            "  id VARCHAR(255) PRIMARY KEY,"
            "  name VARCHAR(255),"
            "  url VARCHAR(255),"
            "  status VARCHAR(50),"
            "  isFavorite BOOLEAN,"
            "  auto_record BOOLEAN,"
            "  viewed BOOLEAN,"
            "  live_stream_url VARCHAR(255),"
            "  preview_image VARCHAR(255),"
            "  createTime DATETIME,"
            "  lastViewTime DATETIME,"
            "  serial_number INT"
            ")"
        ),
        'search_history': (
            "CREATE TABLE IF NOT EXISTS search_history ("
            "  query VARCHAR(255),"
            "  search_time DATETIME"
            ")"
        )
    }

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        for table_name, table_description in tables.items():
            try:
                print(f"正在創建表格 {table_name}...")
                cursor.execute(table_description)
                print(f"表格 {table_name} 創建成功")
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                    print(f"表格 {table_name} 已存在")
                else:
                    print(err.msg)
        cursor.close()
        conn.close()

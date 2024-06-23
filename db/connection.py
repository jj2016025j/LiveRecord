import mysql.connector
from mysql.connector import errorcode
import os

def get_db_connection(with_database=True):
    """
    獲取資料庫連接
    :param with_database: 是否連接到指定的資料庫
    :return: 資料庫連接
    """
    config = {
        'user': os.getenv('MYSQL_USER', 'root'),  # 使用 MySQL 預設使用者
        'password': os.getenv('MYSQL_PASSWORD', ''),  # 使用 MySQL 預設密碼
        'host': os.getenv('MYSQL_HOST', '127.0.0.1')
    }
    if with_database:
        config['database'] = os.getenv('MYSQL_DATABASE', 'livestream_db')

    try:
        conn = mysql.connector.connect(**config)
        return conn
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("使用者名稱或密碼錯誤")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("資料庫不存在")
        else:
            print(err)
        return None

def execute_query(query, params=None):
    """
    執行資料庫插入、更新、刪除操作
    :param query: SQL 查詢語句
    :param params: 查詢參數
    """
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        cursor.close()
        conn.close()
        # print("SQL 執行成功")

def fetch_query(query, params=None):
    """
    執行資料庫查詢操作
    :param query: SQL 查詢語句
    :param params: 查詢參數
    :return: 查詢結果
    """
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        print(f"SQL 查詢成功:{len(rows)}")
        return rows
    return []

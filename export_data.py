from db.operations import get_all_live_streams
from mysql.connector import Error as DBError

from file.file_operations import write_json_file

def export_data_to_json():
    try:
        live_streams = get_all_live_streams()
        data = {
            'live_list': [live_stream.__dict__ for live_stream in live_streams]
        }
        try:
            write_json_file(data)
        except IOError as e:
            print(f"文件寫入失敗: {e}")
    except DBError as e:
        print(f"資料庫操作失敗: {e}")
    except Exception as e:
        print(f"發生未知錯誤: {e}")

if __name__ == '__main__':
    export_data_to_json()

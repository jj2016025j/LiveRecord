import json
import os
from db.operations import add_live_stream, get_live_stream_by_id, update_live_stream
from file.file_operations import read_json_file
from models.live_stream import LiveStream
from mysql.connector import Error as DBError

def load_json_and_insert_to_db(json_file_path):
    data = read_json_file(json_file_path)
        
    live_list = data.get('live_list', [])
    
    for item in live_list:
        try:
            live_stream = LiveStream(
                id=item.get('id', ''),
                name=item.get('name', ''),  # 提供默認值 '' 給缺失的 name 欄位
                url=item.get('url', ''),
                status=item.get('status', ''),
                isFavorite=item.get('isFavorite', False),  # 提供默認值 False
                auto_record=item.get('auto_record', False),  # 提供默認值 False
                viewed=item.get('viewed', False),  # 提供默認值 False
                live_stream_url=item.get('live_stream_url', ''),
                preview_image=item.get('preview_image', ''),
                createTime=item.get('createTime', ''),
                lastViewTime=item.get('lastViewTime', ''),
                serial_number=item.get('serial_number', 0)
            )

            # 檢查是否已存在具有相同主鍵的記錄
            existing_stream = get_live_stream_by_id(live_stream.id)
            if existing_stream:
                print(f"記錄已存在，更新現有記錄: {live_stream.id}")
                update_live_stream(live_stream)
            else:
                add_live_stream(live_stream)

        except DBError as e:
            if e.errno == 1062:  # 重複的主鍵錯誤
                print(f"主鍵重複錯誤: {e}")
            else:
                print(f"資料庫操作失敗: {e}")
        except KeyError as e:
            print(f"資料缺少必要欄位: {e}")
        except Exception as e:
            print(f"導入資料時發生未知錯誤: {e}")

if __name__ == '__main__':
    JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')
    load_json_and_insert_to_db(JSON_FILE_PATH)
    print(f"資料已從 {JSON_FILE_PATH} 導入到資料庫")

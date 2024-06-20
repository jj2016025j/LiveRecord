from store.data_processing import check_and_complete_data
from datetime import datetime
import os
from file.file_operations import read_json_file, write_json_file
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')
FILE_PATH = os.getenv('FILE_PATH', r'/Users/leechiensheng/Movies')
        
# 更新 data_store 並寫入文件的函數
# def update_data_store_and_file(data_store, new_item):
#     try:
#         # 監聽並初始化 live_list
#         print(new_item)
#         print(data_store["live_list"])
#         if "live_list" in data_store and data_store["live_list"] != [] :
#             data_store["live_list"].append(new_item)
#             write_json_file(data_store)
#     except KeyError as e:
#         print(f"鍵錯誤: {e}")
#         raise
#     except Exception as e:
#         print(f"發生未知錯誤: {e}")
#         raise

def organize_json_file(data_store, data_lock, file_path=JSON_FILE_PATH):
    """
    整理 JSON 檔案並清理重複資料。
    """
    # print(f"整理JSON檔案：{file_path}")
    data = read_json_file(file_path)
    
    # 初始化 data_store 中的分類列表
    with data_lock:
        data_store["offline"] = []
        data_store["online"] = []
        data_store["autoRecord"] = []
        data_store["favorites"] = []
    
    unique_items = {}
    cleaned_live_list = []
    
    if "live_list" in data:
        for item in data["live_list"]:
            item = check_and_complete_data(item)
            
            # 移除重複資料，確保 id 唯一
            item_id = item["id"]
            if item_id in unique_items:
                existing_item = unique_items[item_id]
                # 比較創建時間，選擇較新的項目
                if item["createTime"] > existing_item["createTime"]:
                    unique_items[item_id] = item
                # 比較上次觀看時間，更新較新的時間
                if item["lastViewTime"] > existing_item["lastViewTime"]:
                    existing_item["lastViewTime"] = item["lastViewTime"]
                # 更新其他屬性
                if item["status"] == "online":
                    existing_item["status"] = "online"
                if item["autoRecord"]:
                    existing_item["autoRecord"] = True
                if item["isFavorite"]:
                    existing_item["isFavorite"] = True
                if item["live_stream_url"]:
                    existing_item["live_stream_url"] = item["live_stream_url"]
                if item["preview_image"]:
                    existing_item["preview_image"] = item["preview_image"]
            else:
                unique_items[item_id] = item
            
        cleaned_live_list = list(unique_items.values())
        
        with data_lock:           
            # 將資料存回 data_store 中的對應分類
            for item in cleaned_live_list:
                if item["status"] == "offline":
                    data_store["offline"].append(item["id"])
                if item["status"] == "online":
                    data_store["online"].append(item["id"])
                if item["autoRecord"]:
                    data_store["autoRecord"].append(item["id"])
                if item["isFavorite"]:
                    data_store["favorites"].append(item["id"])

            # 更新 data_store 中的 live_list
            data_store["live_list"] = cleaned_live_list
            # print("更新資料庫分類：")
            # print(f"online: {data_store['online']}")
            # print(f"offline: {data_store['offline']}")
            # print(f"autoRecord: {data_store['autoRecord']}")
            # print(f"favorites: {data_store['favorites']}")
    else:
        print("JSON資料中不存在 'live_list' 鍵")
    with data_lock: 
        write_json_file(data_store)
    print(" =================== JSON 文件整理完畢... =================== ")

def update_data_store_and_file(data_store, new_item, lock):
    """
    更新 data_store 並寫入 JSON 檔案。
    新增一筆資料
    """
    with lock:
        # print(len(data_store["live_list"]))
        # print(data_store["live_list"])
        updated_live_list = data_store["live_list"]
        updated_live_list.append(new_item)
        data_store["live_list"] = updated_live_list
        # print(len(data_store["live_list"]))
        # print(data_store["live_list"])
        write_json_file(data_store)

def update_data_store(data_store, new_data, data_lock):
    """
    遞歸更新 data_store 的資料。
    不知道 麻煩解釋清楚
    """
    with data_lock:          
        for key, value in new_data.items():
            if isinstance(value, dict):
                data_store[key] = update_data_store(data_store.get(key, {}), value, data_lock)
            elif isinstance(value, list):
                data_store[key] = value
            elif value not in (None, '', []):
                data_store[key] = value
        return data_store

def initialize_data_store(data_store, data_lock):
    """
    初始化直播流列表資料。
    把讀取的資料放到共用資料data_store中
    """
    try:
        if not os.path.exists(JSON_FILE_PATH):
            raise FileNotFoundError(f"{JSON_FILE_PATH} 文件不存在。")

        json_data = read_json_file(JSON_FILE_PATH)

        if not isinstance(json_data, dict) or 'live_list' not in json_data:
            raise ValueError("JSON 文件格式錯誤或缺少 'live_list' 鍵。")

        live_list = json_data.get('live_list', [])
        # print('取得 live_list 筆數:', len(live_list))
        # 確保每個條目包含必要的鍵值
        for item in live_list:
            item = check_and_complete_data(item)
        
        autoRecord = [item["url"] for item in live_list if item.get("autoRecord")]
        favorites = [item["id"] for item in live_list if item.get("isFavorite")]
        # print('取得 autoRecord 筆數:', len(autoRecord))
        # print('取得 favorites 筆數:', len(favorites))

        if not isinstance(live_list, list):
            raise ValueError("'live_list' 應該是一個列表。")
        
        with data_lock:
            data_store["live_list"] = live_list
            data_store["online"] = []
            data_store["offline"] = []
            data_store["autoRecord"] = autoRecord
            data_store["favorites"] = favorites

            print('初始化的直播流列表:',len(data_store['live_list']))
            print('初始化的自動錄製列表:',len(data_store['autoRecord']))
            # print('初始化的收藏列表:',len(data_store['favorites']))
            # print('線上直播列表:',data_store['online'])
            # print('離線直播列表:',len(data_store['offline']))
            # print('處理中直播列表:',data_store['online_processes'])

        now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f" =================== {now_time} 資料初始化完成 =================== ")
        
        return json_data
    except FileNotFoundError as e:
        print(f"錯誤: {e}")
    except ValueError as e:
        print(f"錯誤: {e}")
    except KeyboardInterrupt:
        print("初始化進程被中斷")
    except Exception as e:
        print(f"初始化過程中發生未知錯誤: {e}")
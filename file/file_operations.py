import json
import os
import portalocker

# 從環境變數中讀取檔案路徑
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'live_list.json')

def read_json_file(file_path=JSON_FILE_PATH):
    """
    讀取 JSON 文件並返回數據。
    """
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        print(f"檔案不存在或為空：{file_path}")
        return {}
    print(f"讀取JSON檔案：{file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except json.JSONDecodeError as e:
        print(f"讀取JSON檔案時出錯：{e}")
        return {}

def write_json_file(data_store):
    """
    安全地写入 JSON 文件
    """
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as file:
            # 获取文件锁
            portalocker.lock(file, portalocker.LOCK_EX)
            data_dict = dict(data_store)
            
            # 过滤掉为空的键
            def filter_empty_keys(d):
                if isinstance(d, dict):
                    return {k: filter_empty_keys(v) for k, v in d.items() if v not in (None, '', [])}
                elif isinstance(d, list):
                    return [filter_empty_keys(v) for v in d if v not in (None, '', [])]
                else:
                    return d
            
            filtered_data_dict = filter_empty_keys(data_dict)
            
            if not filtered_data_dict:
                return
            
            json.dump(filtered_data_dict, file, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"写入 JSON 文件时发生错误: {e}")
        raise
    finally:
        # 释放文件锁
        portalocker.unlock(file)
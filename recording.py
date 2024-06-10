import time
import subprocess
import multiprocessing
from data_store import data_store, extract_live_streams, get_live_stream_url, generate_filename, read_json_file

def execute_ffmpeg_command(command):
    """
    通用的ffmpeg指令執行函數。
    """
    command = [str(arg) for arg in command]
    # print(f"執行指令: {' '.join(command)}")
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def record_stream(stream_url, filename_template):
    """
    錄製直播流。
    """
    # print("直播網址:", stream_url)
    # print("儲存路徑:", filename_template)
    command = [
        'ffmpeg',
        '-i', stream_url,
        '-c', 'copy',
        '-c:a', 'aac',
        '-bsf:a', 'aac_adtstoasc',
        '-f', 'mpegts',
        filename_template
    ]
    execute_ffmpeg_command(command)

def check_and_record_stream(page_url, lock):
    """
    檢查直播流狀態並進行錄製。
    """
    try:
        stream_url, status = get_live_stream_url(page_url)
        if status == "Online":
            print(f"{page_url} 現在在線上。")
            filename_template = generate_filename(page_url)
            if not filename_template:
                print(f"無法生成檔案名稱: {page_url}")
                return
            # print(f"為 {page_url} 開始錄製，儲存檔案為 {filename_template}")
            process = multiprocessing.Process(target=record_stream, args=(stream_url, filename_template))
            process.start()
            with lock:
                data_store["online_streams"][page_url] = process
                if page_url in data_store["offline_streams"]:
                    data_store["offline_streams"].remove(page_url)
        elif status == "Offline":
            # print(f"{page_url} 離線中。添加到離線列表。")
            with lock:
                if page_url not in data_store["offline_streams"]:
                    data_store["offline_streams"].append(page_url)
        else:
            print(f"無法找到 {page_url}。")
    except Exception as e:
        print(f"檢查 {page_url} 時出錯: {e}")

def monitor_streams(lock):
    """
    監控直播流狀態。
    """
    while True:
        time.sleep(30)
        print("正在檢查離線的直播...")
        processes = []
        for page_url in data_store["offline_streams"].copy():
            p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, lock))
            p.start()
            processes.append(p)

        for p in processes:
            p.join()  # 等待所有子進程完成
            
        print("正在檢查線上的直播...")
        with lock:
            for page_url, process in data_store["online_streams"].copy().items():
                if not process.is_alive():
                    print(f"{page_url} 該直播已停止。")
                    data_store["offline_streams"].append(page_url)
                    del data_store["online_streams"][page_url]
                    
def initialize_streams(lock):
    """
    初始化直播流列表並開始錄製在線直播。
    """
    json_file_path = 'live_list.json'
    json_data = read_json_file(json_file_path)
    data_store["live_list"] = json_data
    streams = extract_live_streams(json_data)
    
    processes = []
    for page_url in streams:
        p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, lock))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()  # 等待所有子進程完成
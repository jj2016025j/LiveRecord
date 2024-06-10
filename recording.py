import time
import subprocess
import multiprocessing
from data_store import extract_live_streams, get_live_stream_url, generate_filename, read_json_file

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

def check_and_record_stream(page_url, data_store, lock, status_changes):
    """
    檢查直播流狀態並進行錄製。
    """
    try:
        if not page_url:
            print("url為空")
            return
        stream_url, status = get_live_stream_url(page_url)
        with lock:
            if status == "Online":
                if page_url in data_store["offline_streams"]:
                    data_store["offline_streams"].remove(page_url)
                    status_changes["online"].append(page_url)
                if page_url not in data_store["online_streams"]:
                    filename_template = generate_filename(page_url)
                    process = multiprocessing.Process(target=record_stream, args=(stream_url, filename_template))
                    process.start()
                    data_store["online_streams"][page_url] = process
                status_changes["continuing_online"].append(page_url)
            elif status == "Offline":
                if page_url in data_store["online_streams"]:
                    process = data_store["online_streams"].pop(page_url)
                    process.terminate()
                    process.join()
                    status_changes["offline"].append(page_url)
                if page_url not in data_store["offline_streams"]:
                    data_store["offline_streams"].append(page_url)
            else:
                print(f"無法找到 {page_url}。")
    except Exception as e:
        print(f"檢查 {page_url} 時出錯: {e}")
        with lock:
            data_store["offline_streams"].append(page_url)

def monitor_streams(data_store, lock):
    """
    監控直播流狀態。
    """
    while True:
        time.sleep(60)
        status_changes = {"online": [], "continuing_online": [], "offline": []}
        processes = []

        print("正在檢查直播...")
        for page_url in data_store["offline_streams"].copy():
            p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, data_store, lock, status_changes))
            p.start()
            processes.append(p)

        for p in processes:
            p.join()  # 等待所有子進程完成

        processes.clear()

        with lock:
            for page_url in list(data_store["online_streams"]):
                p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, data_store, lock, status_changes))
                p.start()
                processes.append(p)

        for p in processes:
            p.join()  # 等待所有子進程完成

        if status_changes["online"] or status_changes["continuing_online"] or status_changes["offline"]:
            print("檢查結果:")
            if status_changes["online"]:
                print(f"上線: {status_changes['online']}")
            if status_changes["continuing_online"]:
                print(f"持續在線: {status_changes['continuing_online']}")
            if status_changes["offline"]:
                print(f"離線: {status_changes['offline']}")
        else:
            print("無變動 檢查完畢")

def initialize_streams(data_store, lock):
    """
    初始化直播流列表並開始錄製在線直播。
    """
    json_file_path = 'live_list.json'
    json_data = read_json_file(json_file_path)
    data_store["live_list"] = json_data['live_list']
    streams = extract_live_streams(json_data)
    # print('初始化完成', data_store["live_list"])
    
    processes = []
    status_changes = {"online": [], "continuing_online": [], "offline": []}

    for page_url in streams:
        p = multiprocessing.Process(target=check_and_record_stream, args=(page_url, data_store, lock, status_changes))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()  # 等待所有子進程完成

    print("初始化結果:")
    if status_changes["online"]:
        print(f"上線: {status_changes['online']}")
    if status_changes["continuing_online"]:
        print(f"持續在線: {status_changes['continuing_online']}")
    if status_changes["offline"]:
        print(f"離線: {status_changes['offline']}")
    if not (status_changes["online"] or status_changes["continuing_online"] or status_changes["offline"]):
        print("無變動 初始化完畢")

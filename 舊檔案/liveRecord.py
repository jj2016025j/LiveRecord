import time
import cv2
import subprocess
import re
import multiprocessing
from datetime import datetime
from 舊檔案.get_live_stream_url import get_live_stream_url
import json

def generate_filename(url):
    # fixed_path = r"C:\Users\User\Desktop\新增資料夾\錄影"
    fixed_path = r"D:\01照片分類\直播moniturbate"
    match = re.search(r'amlst:([^:]+?)-sd', url)
    file_name = '_'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{fixed_path}\\{file_name}_{timestamp}.mp4"

def record_stream(stream_url, filename, duration):
    command = [
        'ffmpeg',
        '-i', stream_url,
        '-c', 'copy',
        '-c:a', 'aac',
        '-bsf:a', 'aac_adtstoasc',
        '-f', 'mpegts',  # 指定輸出格式為 .ts
        # '-t', duration,  # 設定錄製時長
        # '-re', # 可以拿掉
        # '-strict', '-2',
        # '-f', 'hls',
        # '-hls_time', '600',
        # '-hls_list_size', '0',
        # '-f', 'segment',
        # '-segment_time', '600',  # 每10分钟一个片段
        filename
    ]
    subprocess.run(command)
    
    # process = subprocess.Popen(command)
    # return process
    
    # if duration:
    #     command.insert(4, '-t')
    #     command.insert(5, duration)
    # process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # return process


def convert_ts_to_mp4(input_file, filename):
    command = [
        'ffmpeg',
        '-i', input_file,
        '-c', 'copy',
        filename
    ]
    subprocess.run(command)
    # subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def remux_file(input_file, filename):
    command = [
        'ffmpeg',
        '-i', input_file,
        '-c', 'copy',
        filename
    ]
    subprocess.run(command)
    
def show_preview(stream_url):
    cap = cv2.VideoCapture(stream_url)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imshow('Preview', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):  # 按 'q' 鍵退出預覽
            break
    cap.release()
    cv2.destroyAllWindows()

def extract_name_from_url(url):
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def extract_live_streams(json_data):
    live_streams = []
    for item in json_data['live_list']:
        live_streams.append(item['page_url'])
    return live_streams

def monitor_streams(online_streams, offline_streams, duration):
    while True:
        time.sleep(30)
        print("Checking offline streams...")
        for page_url in offline_streams.copy():
            try:
                stream_url = get_live_stream_url(page_url)
                print(f"{page_url} is now online.")
                filename = generate_filename(page_url)
                process = multiprocessing.Process(target=record_stream, args=(stream_url, filename, duration))
                process.start()
                online_streams[page_url] = process
                offline_streams.remove(page_url)
            except Exception as e:
                print(f"{page_url} is still offline.")

        print("Checking online streams...")
        for page_url, process in online_streams.copy().items():
            if not process.is_alive():
                print(f"{page_url} has stopped recording.")
                offline_streams.append(page_url)
                del online_streams[page_url]
                
def main():
    json_file_path = 'live_list.json'
    json_data = read_json_file(json_file_path)
    streams = extract_live_streams(json_data)

    duration = "1:00:00"
    online_streams = {}
    offline_streams = []
    
    for page_url in streams:
        try:
            stream_url = get_live_stream_url(page_url)
            print(f"{page_url} is online. Starting recording...")
            filename = generate_filename(page_url)
            process = multiprocessing.Process(target=record_stream, args=(stream_url, filename, duration))
            process.start()
            online_streams[page_url] = process    
            
        except Exception as e:
            print(f"{page_url} is offline. Adding to offline list.")
            offline_streams.append(page_url)
    
    monitor_process = multiprocessing.Process(target=monitor_streams, args=(online_streams, offline_streams, duration))
    
    try:
        monitor_process.start()
    except Exception:
        print('error')

    try:
        monitor_process.join()
    except KeyboardInterrupt:
        print("Stopping all processes...")
        monitor_process.terminate()
        monitor_process.join()
        for process in online_streams.values():
            process.terminate()
            process.join()

if __name__ == '__main__':
    main()
    
# 解決方法一：使用 -re 選項進行實時錄製
# 在錄製直播流時，使用 -re 選項來告訴 FFmpeg 以實時速度處理流數據，這可能有助於防止文件損壞。
# 解決方法二：使用 HLS 流錄製
# 如果使用 HLS 流錄製，可以有效避免這些問題。Streamlink 支持將直播流轉換為 HLS 流。

import cv2
import subprocess
import streamlink
import re
import multiprocessing
from datetime import datetime
from get_live_stream_url import get_live_stream_url
import json

def generate_filename(url):
    fixed_path = r"C:\Users\User\Desktop\新增資料夾\錄影"
    match = re.search(r'amlst:([^:]+?)-sd', url)
    file_name = '_'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{fixed_path}\\{file_name}_{timestamp}.mp4"

def get_stream_url(page_url):
    session = streamlink.Streamlink()
    session.set_option('http-headers', {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    streams = streamlink.streams(page_url)
    # print('======================streams: ',streams)
    if "best" in streams:
        return streams["best"].url
    else:
        raise Exception("No stream available")

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

def main():
    json_file_path = 'live_list.json'
    json_data = read_json_file(json_file_path)
    streams = extract_live_streams(json_data)

    duration = "1:00:00"
    processes = []

    for page_url in streams:
        try:
            print(f"Fetching stream URL for {page_url}...")
            stream_url = get_live_stream_url(page_url)
            print('URL: ',stream_url)
            
            # # 開啟新的進程來顯示預覽畫面
            if(False):
                preview_process = multiprocessing.Process(target=show_preview, args=(stream_url,))
                preview_process.start()
                process.start()
                processes.append(preview_process)

            # 
            filename = generate_filename(page_url)
            # print(f"Recording stream from {stream_url} to {filename}...")
            # record_process  = record_stream(stream_url, generate_filename(filename), duration) 
            record_process  = multiprocessing.Process(target=record_stream, args=(stream_url, filename, duration))
            record_process .start()
            processes.append(record_process)

            # 轉檔
            if(False):
                fixed_filename = f"fixed_{filename}"
                print(f"Remuxing {filename} to {fixed_filename}...")
                remux_file(filename, fixed_filename)
                print(f"Finished remuxing {filename} to {fixed_filename}")
            
        except Exception as e:
            print(f"Error recording {page_url}: {e}")
    try:
        while True:
            for process in processes:
                if not process.is_alive():
                    processes.remove(process)
            if not processes:
                break
    except KeyboardInterrupt:
        print("Stopping recording...")
        for process in processes:
            process.terminate()
        for process in processes:
            process.join()
            
    # try:
    #     while True:
    #         time.sleep(1)  # 每秒檢查一次
    # except KeyboardInterrupt:
    #     print("Stopping recording...")
    #     for process in processes:
    #         process.terminate()
    #     for process in processes:
    #         process.wait()
    #     for ts_filename in streams.values():
    #         mp4_filename = ts_filename.replace('.ts', '.mp4')
    #         print(f"Converting {ts_filename} to {mp4_filename}...")
    #         convert_ts_to_mp4(ts_filename, mp4_filename)
    #         print(f"Finished converting {ts_filename} to {mp4_filename}")

if __name__ == '__main__':
    main()
    
# 解決方法一：使用 -re 選項進行實時錄製
# 在錄製直播流時，使用 -re 選項來告訴 FFmpeg 以實時速度處理流數據，這可能有助於防止文件損壞。
# 解決方法二：使用 HLS 流錄製
# 如果使用 HLS 流錄製，可以有效避免這些問題。Streamlink 支持將直播流轉換為 HLS 流。

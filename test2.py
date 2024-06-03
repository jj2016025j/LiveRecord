# 解決方法一：使用 -re 選項進行實時錄製
# 在錄製直播流時，使用 -re 選項來告訴 FFmpeg 以實時速度處理流數據，這可能有助於防止文件損壞。

# 解決方法二：使用 HLS 流錄製
# 如果使用 HLS 流錄製，可以有效避免這些問題。Streamlink 支持將直播流轉換為 HLS 流。

# 成功  也會毀損y
import cv2
import subprocess
import streamlink
import multiprocessing
import time

def get_stream_url(page_url):
    streams = streamlink.streams(page_url)
    if "best" in streams:
        return streams["best"].url
    else:
        raise Exception("No stream available")

def record_stream(stream_url, output_file, duration):
    command = [
        'ffmpeg',
        '-i', stream_url,
        '-c', 'copy',
        '-bsf:a', 'aac_adtstoasc',
        '-f', 'mpegts',  # 指定輸出格式為 .ts
        '-t', duration,  # 設定錄製時長
        output_file
    ]
    subprocess.run(command)
    # process = subprocess.Popen(command)
    # return process
    
    # if duration:
    #     command.insert(4, '-t')
    #     command.insert(5, duration)
    # process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # return process


def convert_ts_to_mp4(input_file, output_file):
    command = [
        'ffmpeg',
        '-i', input_file,
        '-c', 'copy',
        output_file
    ]
    subprocess.run(command)
    # subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def remux_file(input_file, output_file):
    command = [
        'ffmpeg',
        '-i', input_file,
        '-c', 'copy',
        output_file
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

def main():
    streams = {
        'https://www.youtube.com/watch?v=21X5lGlDOfg': 'test2.mp4',
    }
    duration = "00:10:00"  # 設定錄製 1 小時

    processes = []

    for page_url, output_file in streams.items():
        try:
            print(f"Fetching stream URL for {page_url}...")
            stream_url = get_stream_url(page_url)
            
            # # 開啟新的進程來顯示預覽畫面
            # preview_process = multiprocessing.Process(target=show_preview, args=(stream_url,))
            # preview_process.start()
            
            print(f"Recording stream from {stream_url} to {output_file}...")
            process = record_stream(stream_url, output_file, duration)
            print(f"Finished recording {page_url} to {output_file}")
            processes.append(process)

            # fixed_output_file = f"fixed_{output_file}"
            # print(f"Remuxing {output_file} to {fixed_output_file}...")
            # remux_file(output_file, fixed_output_file)
            # print(f"Finished remuxing {output_file} to {fixed_output_file}")
            
        except Exception as e:
            print(f"Error recording {page_url}: {e}")
    
    # try:
    #     while True:
    #         time.sleep(1)  # 每秒檢查一次
    # except KeyboardInterrupt:
    #     print("Stopping recording...")
    #     for process in processes:
    #         process.terminate()
    #     for process in processes:
    #         process.wait()
    #     for ts_output_file in streams.values():
    #         mp4_output_file = ts_output_file.replace('.ts', '.mp4')
    #         print(f"Converting {ts_output_file} to {mp4_output_file}...")
    #         convert_ts_to_mp4(ts_output_file, mp4_output_file)
    #         print(f"Finished converting {ts_output_file} to {mp4_output_file}")

if __name__ == '__main__':
    main()

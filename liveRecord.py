# 成功  也會毀損y
import cv2
import subprocess
import streamlink
import re
import multiprocessing
from streamlink.plugins.chaturbate import Chaturbate
from datetime import datetime

def generate_filename(base_name):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    fixed_path = r"C:\Users\User\Desktop\新增資料夾\錄影"
    return f"{fixed_path}\\{base_name}_{timestamp}.mp4"

def get_stream_url(page_url):
    session = streamlink.Streamlink()
    session.set_option('http-headers', {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    streams = streamlink.streams(page_url)
    # print('不知道是甚麼?',streams)
    if "best" in streams:
        return streams["best"].url
    else:
        raise Exception("No stream available")

def record_stream(stream_url, output_file, duration):
    command = [
        'ffmpeg',
        # '-re', # 可以拿掉
        '-i', stream_url,
        '-c', 'copy',
        '-c:a', 'aac',
        # '-strict', '-2',
        '-bsf:a', 'aac_adtstoasc',
        '-f', 'mpegts',  # 指定輸出格式為 .ts mpegts
        # '-t', duration,  # 設定錄製時長
        # '-f', 'hls',
        # '-hls_time', '600',
        # '-hls_list_size', '0',
        # '-f', 'segment',
        # '-segment_time', '600',  # 每10分钟一个片段
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
        # 'https://www.youtube.com/watch?v=21X5lGlDOfg': 'youtube_test1.mp4',
        # 'https://www.youtube.com/watch?v=gp2K_xfEDoU': 'youtube_test.mp4',
        # 'https://www.twitch.tv/iitifox': 'twitch_test.mp4',        
        'https://chaturbate.com/haileygrx/': 'chaturbate_test.mp4',
        'https://chaturbate.com/6b4090fc-e7f0-487c-a31a-e8d28f078401': 'chaturbate_test2.mp4',
        # 'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:crazybabyyy-sd-ca57b3ca530f366cf10086dbc7d74829c6e13fb6e4cec06f3fcb6b16e1d1619d_trns_h264/chunklist_w738483245_b5128000_t64RlBTOjMwLjA=.m3u8': 
        #     'crazybabyyy',
        'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:charming_girls-sd-57bb10124016d99c7273225faffa4f7bc2a17eff953f6db3f09cedaf04ed86db_trns_h264/chunklist_w1639753809_b7128000_t64RlBTOjYwLjA=.m3u8': 
            'charming_girls',
        'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:mariemelons-sd-65dfe7dd48dd5ec616e307709f8197fe89f61cb69bbd7e87091776b800c14576_trns_h264/chunklist_w437752321_b5128000_t64RlBTOjMwLjA=.m3u8': 
            'mariemelons',
        'https://edge15-nrt.live.mmcdn.com/live-edge/amlst:haru_blossom-sd-30b228fb532cd061de2898bb063c958bc95853389ac9de78a88e4bbabe2798f4_trns_h264/chunklist_w116063115_b5128000_t64RlBTOjMwLjA=.m3u8': 
            'haru_blossom',
        'https://edge18-nrt.live.mmcdn.com/live-edge/amlst:haileygrx-sd-05b7af415826f266c57ace8b147fc12e54cade4012c235a768411257f088b1a4_trns_h264/chunklist_w713500881_b7128000_t64RlBTOjUwLjA=.m3u8': 
            'haileygrx',
        'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:kerelai-sd-525df226343877ee85f39c2557892f45b335b106f3f5727db8c83f02e6995000_trns_h264/chunklist_w824028657_b5128000_t64RlBTOjMwLjA=.m3u8': 
            'kerelai',
        'https://edge6-nrt.live.mmcdn.com/live-edge/amlst:one_more_cum-sd-b7f40d0c6d3d8b2909daf9a4ab8b77bb64683c78e8ce1e4d6e24051f5b11c2b7_trns_h264/chunklist_w651470336_b5128000_t64RlBTOjMwLjA=.m3u8': 
            'one_more_cum',
        # 'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:kerelai-sd-525df226343877ee85f39c2557892f45b335b106f3f5727db8c83f02e6995000_trns_h264/chunklist_w824028657_b5128000_t64RlBTOjMwLjA=.m3u8': 
        #     'kerelai',
    }

    duration = "23:59:59"  # 設定錄製 1 小時
# 
# 
    processes = []

    for page_url, output_file in streams.items():
        try:
            print(f"Fetching stream URL for {page_url}...")
            stream_url = get_stream_url(page_url)
            print('網址: ',stream_url)
            
            # # 開啟新的進程來顯示預覽畫面
            # preview_process = multiprocessing.Process(target=show_preview, args=(stream_url,))
            # preview_process.start()
            
            # 
            print(f"Recording stream from {stream_url} to {output_file}...")
            process = record_stream(stream_url, generate_filename(output_file), duration)
            # process = multiprocessing.Process(target=record_stream, args=(stream_url, generate_filename(output_file), duration))
            process.start()
            
            print(f"Finished recording {page_url} to {output_file}")
            processes.append(process)

            # 轉檔
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
    
# 解決方法一：使用 -re 選項進行實時錄製
# 在錄製直播流時，使用 -re 選項來告訴 FFmpeg 以實時速度處理流數據，這可能有助於防止文件損壞。
# 解決方法二：使用 HLS 流錄製
# 如果使用 HLS 流錄製，可以有效避免這些問題。Streamlink 支持將直播流轉換為 HLS 流。

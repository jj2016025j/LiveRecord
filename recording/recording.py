# record.py
from datetime import datetime
import os
import subprocess

from utils.utils import extract_name_from_stream_url

def execute_ffmpeg_command(command):
    """
    通用的 ffmpeg 指令執行函數。
    """
    command = [str(arg) for arg in command]
    try:
        # print(f"執行指令: {' '.join(command)}")
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode != 0:
            print(f"執行 ffmpeg 指令失敗: {result.stderr.decode('utf-8')}")
        return result.returncode
    except Exception as e:
        print(f"執行 ffmpeg 指令時發生錯誤: {e}")
        return -1

def record_stream(live_stream_url, filename_template, data_store, data_lock, url):
    """
    錄製直播流。
    """
    try:
        if live_stream_url and filename_template:
            # print("直播網址:", live_stream_url)
            # print("儲存路徑:", filename_template)
            command = [
                'ffmpeg',
                '-i', live_stream_url,
                '-c', 'copy',
                '-c:a', 'aac',
                '-bsf:a', 'aac_adtstoasc',
                '-f', 'mpegts',
                filename_template
            ]
            returncode = execute_ffmpeg_command(command)
            if returncode == 0:
                print(f"錄製完成: {filename_template}")
            else:
                print(f"錄製失敗: {filename_template}")

            # 錄製結束後更新錄製清單
            with data_lock:
                recording_list = data_store['recording_list']
                if url in recording_list:
                    recording_list.remove(url)
                data_store["recording_list"] = recording_list
                for item in data_store["live_list"]:
                    if item.get("url") == url:
                        item["status"] = 'offline'
                        item["lastViewTime"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
 
                print(f"錄製結束，已從錄製清單中移除: {url}")
    except Exception as e:
        print(f"執行錄製時發生錯誤: {e}")
            
def capture_preview_image(live_stream_url, output_dir):
    """
    從直播流中截取一張預覽圖。
    """
    # print(f"開始截取預覽圖: {live_stream_url}")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"創建目錄: {output_dir}")
    
    live_name = extract_name_from_stream_url(live_stream_url)
    if not live_name:
        print(f"無法從直播流 URL 提取名稱: {live_stream_url}")
        return None
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    preview_image_path = os.path.join(output_dir, f"preview_{live_name}_{timestamp}.jpg")
    
    command = [
        'ffmpeg',
        '-i', live_stream_url,
        '-frames:v', '1',
        '-q:v', '2',
        preview_image_path
    ]
    execute_ffmpeg_command(command)
    
    if os.path.exists(preview_image_path):
        # print(f"預覽圖儲存於: {preview_image_path}")
        return preview_image_path
    else:
        print(f"無法儲存預覽圖: {preview_image_path}")
        return None
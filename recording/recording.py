from datetime import datetime
import os
from utils.utils import extract_name_from_stream_url
from utils.ffmpeg import execute_ffmpeg_command

def start_recording_process(live_stream_url, filename_template, data_store, data_lock, url):
    """
    錄製直播流
    """
    try:
        if live_stream_url and filename_template:
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

def stop_recording_process(url):
    """
    停止錄製進程
    """
    # 實現停止錄製的邏輯
    pass

def capture_preview_image(live_stream_url, output_dir):
    """
    從直播流中截取預覽圖
    """
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

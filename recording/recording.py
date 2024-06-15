# record.py
from datetime import datetime
import os
import subprocess

from utils.utils import extract_name_from_steam_url

def execute_ffmpeg_command(command):
    """
    通用的ffmpeg指令執行函數。
    """
    command = [str(arg) for arg in command]
    # print(f"執行指令: {' '.join(command)}")
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def record_stream(live_stream_url, filename_template):
    """
    錄製直播流。
    """
    # print("直播網址:", live_stream_url)
    print("儲存路徑:", filename_template)
    command = [
        'ffmpeg',
        '-i', live_stream_url,
        '-c', 'copy',
        '-c:a', 'aac',
        '-bsf:a', 'aac_adtstoasc',
        '-f', 'mpegts',
        filename_template
    ]
    execute_ffmpeg_command(command)

def capture_preview_image(live_stream_url, output_dir):
    """
    從直播流中截取一張預覽圖。
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    liveName = extract_name_from_steam_url(live_stream_url)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    preview_image_path = os.path.join(output_dir, f"preview_{liveName}_{timestamp}.jpg")
    
    command = [
        'ffmpeg',
        '-i', live_stream_url,
        '-frames:v', '1',
        '-q:v', '2',
        preview_image_path
    ]
    execute_ffmpeg_command(command)
    
    return preview_image_path
# record.py
import subprocess

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
    print("儲存路徑:", filename_template)
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

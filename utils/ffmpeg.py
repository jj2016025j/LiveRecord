import os
import subprocess

def execute_ffmpeg_command(command):
    """
    執行 ffmpeg 指令
    """
    command = [str(arg) for arg in command]
    try:
        print(f"執行指令: {' '.join(command)}")
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode != 0:
            print(f"執行 ffmpeg 指令失敗: {result.stderr.decode('utf-8')}")
        return result.returncode
    except Exception as e:
        print(f"執行 ffmpeg 指令時發生錯誤: {e}")
        return -1

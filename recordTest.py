import cv2
import subprocess

# 之後再研究 沒成功
# 打開攝像頭
cap = cv2.VideoCapture(0)

# 定義 FFmpeg 命令
command = [
    'ffmpeg',
    '-y',  # 覆蓋輸出文件
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-pix_fmt', 'bgr24',
    '-s', '640x480',  # 攝像頭解析度
    '-r', '24',  # 幀率
    '-i', '-',  # 從標準輸入讀取
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-f', 'flv',  # 輸出格式
    'rtmp://localhost/live/stream'  # 推流到本地 RTMP 伺服器
]

# 啟動 FFmpeg
proc = subprocess.Popen(command, stdin=subprocess.PIPE)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    # 將視頻幀寫入 FFmpeg 的標準輸入 這裡會出錯
    proc.stdin.write(frame.tobytes())

cap.release()
proc.stdin.close()
proc.wait()


# ffmpeg -i rtmp://localhost/live/stream -c copy output.mp4

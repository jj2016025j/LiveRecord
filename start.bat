@echo off
chcp 65001 > nul

echo 正在啟動後端服務...
start "後端服務" cmd /c "python main.py"

@REM timeout /t 10 /nobreak > nul
echo 等待10秒後啟動前端服務...
timeout /t 10 /nobreak

echo 正在啟動前端服務...
start "前端服務" cmd /c "yarn dev"

echo 等待前端服務啟動...
timeout /t 10 /nobreak

echo 開啟瀏覽器並訪問 http://localhost:3045/ ...
start "" "http://localhost:3045/"

echo 所有服務已嘗試啟動。
echo 等待5秒後關閉此視窗...
timeout /t 5 /nobreak
exit

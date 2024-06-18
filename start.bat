@echo off
chcp 65001 > nul

@REM echo 啟動後端服務...
@REM start "後端服務" cmd /c "cd 後端目錄 && call 後端啟動.bat"

echo 正在啟動後端服務...
python main.py

echo 後端服務已成功啟動。

@REM timeout /t 10 /nobreak > nul
echo 等待10秒後啟動前端服務...
timeout /t 10 /nobreak

@REM echo 啟動前端服務...
@REM start "前端服務" cmd /c "cd 前端目錄 && call 前端啟動.bat"

echo 正在啟動前端服務...
yarn dev

echo 前端服務已成功啟動。

echo 所有服務已嘗試啟動。
echo 等待5秒後關閉此視窗...
timeout /t 5 /nobreak
exit

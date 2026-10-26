@echo off
echo 清理缓存目录...
rmdir /s /q .next 2>nul

echo 设置环境变量...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max-old-space-size=4096

echo 启动开发服务器...
npx next dev --turbo
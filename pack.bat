@echo off
echo 正在打包莴笋录屏官网部署文件...

cd /d "%~dp0"

REM 创建临时目录
if exist deploy-temp rmdir /s /q deploy-temp
mkdir deploy-temp

REM 复制需要的文件
echo 复制文件...
copy index.html deploy-temp\
copy style.css deploy-temp\
copy script.js deploy-temp\
copy server.js deploy-temp\
copy package.json deploy-temp\
copy README.md deploy-temp\
copy DEPLOY.md deploy-temp\
copy .gitignore deploy-temp\
copy deploy.sh deploy-temp\
copy nginx.conf deploy-temp\

REM 复制assets目录
xcopy /E /I assets deploy-temp\assets

REM 创建压缩包（需要7-Zip或WinRAR）
echo 创建压缩包...
if exist "C:\Program Files\7-Zip\7z.exe" (
    "C:\Program Files\7-Zip\7z.exe" a -tzip wosun-website-deploy.zip deploy-temp\*
    echo 打包完成: wosun-website-deploy.zip
) else if exist "C:\Program Files\WinRAR\WinRAR.exe" (
    "C:\Program Files\WinRAR\WinRAR.exe" a -afzip wosun-website-deploy.zip deploy-temp\*
    echo 打包完成: wosun-website-deploy.zip
) else (
    echo 未找到7-Zip或WinRAR，请手动压缩 deploy-temp 目录
)

REM 清理临时目录
rmdir /s /q deploy-temp

echo.
echo 部署包已创建完成！
echo 请将 wosun-website-deploy.zip 上传到Linux服务器
pause
#!/bin/bash

# 莴笋录屏官网部署脚本

echo "开始部署莴笋录屏官网..."

# 1. 更新系统包
echo "1. 更新系统包..."
sudo apt-get update

# 2. 安装Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    echo "2. 安装Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "2. Node.js已安装，跳过..."
fi

# 3. 安装PM2 (如果未安装)
if ! command -v pm2 &> /dev/null; then
    echo "3. 安装PM2..."
    sudo npm install -g pm2
else
    echo "3. PM2已安装，跳过..."
fi

# 4. 进入项目目录
cd /var/www/wosun-website || exit

# 5. 安装依赖
echo "4. 安装项目依赖..."
npm install --production

# 6. 创建数据目录
echo "5. 创建数据目录..."
mkdir -p data

# 7. 停止旧进程
echo "6. 停止旧进程..."
pm2 stop wosun-website 2>/dev/null || true
pm2 delete wosun-website 2>/dev/null || true

# 8. 启动应用
echo "7. 启动应用..."
pm2 start server.js --name wosun-website

# 9. 设置开机自启
echo "8. 设置开机自启..."
pm2 startup
pm2 save

# 10. 显示状态
echo "9. 部署完成！"
pm2 status

echo ""
echo "访问地址: http://your-server-ip:3000"
echo "查看日志: pm2 logs wosun-website"
echo "重启应用: pm2 restart wosun-website"
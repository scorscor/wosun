#!/bin/bash

# 莴笋录屏网站 Docker 部署脚本

echo "=========================================="
echo "开始部署莴笋录屏网站"
echo "=========================================="

# 停止并删除旧容器
echo "1. 停止并删除旧容器..."
docker compose down

# 删除旧镜像（可选，节省空间）
echo "2. 删除旧镜像..."
docker rmi wosun-website-wosun-website 2>/dev/null || echo "没有找到旧镜像，跳过删除"

# 重新构建镜像
echo "3. 重新构建 Docker 镜像..."
docker compose build --no-cache

# 启动容器
echo "4. 启动容器..."
docker compose up -d

# 等待容器启动
echo "5. 等待容器启动..."
sleep 3

# 检查容器状态
echo "6. 检查容器状态..."
docker compose ps

# 查看容器日志
echo "7. 查看最近的日志..."
docker compose logs --tail=20

echo "=========================================="
echo "部署完成！"
echo "网站地址: http://localhost:3000"
echo "=========================================="

#!/bin/bash

# 查看莴笋录屏网站日志

echo "查看容器日志（按 Ctrl+C 退出）..."
docker compose logs -f --tail=50

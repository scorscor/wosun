# 莴笋录屏官网 - Docker部署指南

## 快速部署

### 1. 安装Docker

```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 部署网站

#### 方式一：使用Git（推荐）

```bash
# 克隆仓库
git clone 你的仓库地址 /var/www/wosun-website
cd /var/www/wosun-website

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 方式二：手动上传

```bash
# 上传项目文件
scp -r * root@your-server:/var/www/wosun-website/

# 登录服务器
ssh root@your-server
cd /var/www/wosun-website

# 启动容器
docker-compose up -d
```

### 3. 配置Nginx反向代理

```bash
# 复制配置文件到vhost目录
cp wosun.scor.vip.conf /usr/local/nginx/conf/vhost/

# 测试配置
/usr/local/nginx/sbin/nginx -t

# 重启Nginx
/usr/local/nginx/sbin/nginx -s reload
```

### 4. 配置HTTPS（可选）

```bash
# 安装Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d wosun.scor.vip

# 自动续期
sudo certbot renew --dry-run
```

---

## 常用命令

### Docker管理

```bash
# 启动容器
docker-compose up -d

# 停止容器
docker-compose down

# 重启容器
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看容器状态
docker-compose ps

# 进入容器
docker exec -it wosun-website sh
```

### 更新代码

```bash
cd /var/www/wosun-website

# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

### 一键更新脚本

```bash
# 创建更新脚本
cat > /var/www/wosun-website/update.sh << 'EOF'
#!/bin/bash
cd /var/www/wosun-website
echo "拉取最新代码..."
git pull
echo "重新构建容器..."
docker-compose up -d --build
echo "更新完成！"
docker-compose ps
EOF

chmod +x /var/www/wosun-website/update.sh
```

以后更新只需执行：

```bash
/var/www/wosun-website/update.sh
```

---

## 数据备份

### 备份留言数据

```bash
# 手动备份
cp /var/www/wosun-website/data/messages.json /var/www/wosun-website/data/messages.json.backup

# 定时备份（添加到crontab）
crontab -e
# 添加：0 2 * * * cp /var/www/wosun-website/data/messages.json /var/www/wosun-website/data/messages.json.$(date +\%Y\%m\%d)
```

---

## 故障排查

### 查看容器日志

```bash
docker-compose logs -f wosun-website
```

### 端口被占用

```bash
# 查看3000端口占用
sudo lsof -i :3000

# 修改docker-compose.yml中的端口映射
# ports:
#   - "8080:3000"  # 改为其他端口
```

### 重新构建容器

```bash
docker-compose down
docker-compose up -d --build
```

---

## 性能优化

### 限制容器资源

编辑 `docker-compose.yml`：

```yaml
services:
  wosun-website:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 查看资源使用

```bash
docker stats wosun-website
```

---

## 访问网站

- HTTP: http://wosun.scor.vip
- HTTPS: https://wosun.scor.vip (配置SSL后)
- 直接访问: http://your-server-ip:3000
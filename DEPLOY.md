# 莴笋录屏官网 - 部署指南

## 方式一：快速部署（推荐）

### 1. 上传文件到服务器

将整个项目文件夹上传到服务器的 `/var/www/wosun-website` 目录：

```bash
# 在本地执行
scp -r * root@your-server-ip:/var/www/wosun-website/
```

### 2. 执行部署脚本

```bash
# 登录服务器
ssh root@your-server-ip

# 赋予执行权限
chmod +x /var/www/wosun-website/deploy.sh

# 执行部署
cd /var/www/wosun-website
./deploy.sh
```

部署完成后，访问 `http://your-server-ip:3000` 即可查看网站。

---

## 方式二：手动部署

### 1. 安装Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 上传项目文件

```bash
scp -r * root@your-server-ip:/var/www/wosun-website/
```

### 3. 安装依赖

```bash
cd /var/www/wosun-website
npm install --production
```

### 4. 使用PM2管理进程

```bash
# 安装PM2
sudo npm install -g pm2

# 启动应用
pm2 start server.js --name wosun-website

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
```

---

## 配置Nginx反向代理（可选）

### 1. 安装Nginx

```bash
sudo apt-get install nginx
```

### 2. 配置Nginx

```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/wosun-website

# 配置已包含域名 wosun.scor.vip，无需修改

# 创建软链接
sudo ln -s /etc/nginx/sites-available/wosun-website /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 3. 配置防火墙

```bash
# 开放80端口
sudo ufw allow 80

# 开放443端口（如果使用HTTPS）
sudo ufw allow 443
```

---

## 配置HTTPS（可选）

### 使用Let's Encrypt免费证书

```bash
# 安装Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书（域名：wosun.scor.vip）
sudo certbot --nginx -d wosun.scor.vip

# 自动续期
sudo certbot renew --dry-run
```

---

## 常用命令

### PM2管理

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs wosun-website

# 重启应用
pm2 restart wosun-website

# 停止应用
pm2 stop wosun-website

# 删除应用
pm2 delete wosun-website
```

### 查看留言数据

```bash
cat /var/www/wosun-website/data/messages.json
```

### 备份留言数据

```bash
# 创建备份
cp /var/www/wosun-website/data/messages.json /var/www/wosun-website/data/messages.json.backup

# 定时备份（添加到crontab）
crontab -e
# 添加：0 2 * * * cp /var/www/wosun-website/data/messages.json /var/www/wosun-website/data/messages.json.$(date +\%Y\%m\%d)
```

---

## 目录结构

```
/var/www/wosun-website/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 前端脚本
├── server.js           # 后端服务器
├── package.json        # 项目配置
├── deploy.sh           # 部署脚本
├── nginx.conf          # Nginx配置
├── assets/             # 资源文件
│   ├── wosun.svg
│   └── floder.svg
└── data/               # 数据目录
    └── messages.json   # 留言数据
```

---

## 故障排查

### 1. 端口被占用

```bash
# 查看3000端口占用
sudo lsof -i :3000

# 杀死进程
sudo kill -9 <PID>
```

### 2. 权限问题

```bash
# 修改目录权限
sudo chown -R $USER:$USER /var/www/wosun-website
sudo chmod -R 755 /var/www/wosun-website
```

### 3. 查看错误日志

```bash
# PM2日志
pm2 logs wosun-website --err

# Nginx日志
sudo tail -f /var/log/nginx/wosun-website-error.log
```

---

## 性能优化建议

1. **启用Gzip压缩**（在Nginx配置中）
2. **使用CDN加速静态资源**
3. **定期清理旧留言数据**
4. **监控服务器资源使用情况**

---

## 安全建议

1. **定期更新系统和依赖包**
2. **配置防火墙规则**
3. **使用HTTPS加密传输**
4. **定期备份留言数据**
5. **监控异常访问**
# HTTPS配置指南

## 方式一：使用Let's Encrypt免费证书（推荐）

### 1. 安装acme.sh

```bash
# 安装acme.sh
curl https://get.acme.sh | sh

# 重新加载环境变量
source ~/.bashrc
```

### 2. 申请SSL证书

```bash
# 申请证书（使用DNS验证或HTTP验证）
# 方式1：HTTP验证（需要先配置HTTP访问）
~/.acme.sh/acme.sh --issue -d wosun.scor.vip --webroot /var/www/wosun-website

# 方式2：DNS验证（推荐，更安全）
# 需要在域名DNS添加TXT记录，acme.sh会提示你添加什么记录
~/.acme.sh/acme.sh --issue --dns -d wosun.scor.vip
```

### 3. 安装证书到Nginx

```bash
# 创建SSL证书目录
mkdir -p /usr/local/nginx/conf/ssl/wosun.scor.vip

# 安装证书
~/.acme.sh/acme.sh --install-cert -d wosun.scor.vip \
  --key-file /usr/local/nginx/conf/ssl/wosun.scor.vip/privkey.pem \
  --fullchain-file /usr/local/nginx/conf/ssl/wosun.scor.vip/fullchain.pem \
  --reloadcmd "/usr/local/nginx/sbin/nginx -s reload"
```

### 4. 更新Nginx配置

```bash
# 复制HTTPS配置文件
cp wosun.scor.vip.conf /usr/local/nginx/conf/vhost/

# 测试配置
/usr/local/nginx/sbin/nginx -t

# 重启Nginx
/usr/local/nginx/sbin/nginx -s reload
```

### 5. 设置自动续期

```bash
# acme.sh会自动添加crontab任务，每天检查并自动续期
# 查看定时任务
crontab -l
```

---

## 方式二：使用阿里云/腾讯云免费证书

### 1. 申请证书

1. 登录阿里云或腾讯云控制台
2. 进入SSL证书管理
3. 申请免费证书（DV证书，1年有效期）
4. 下载Nginx格式的证书

### 2. 上传证书到服务器

```bash
# 创建证书目录
mkdir -p /usr/local/nginx/conf/ssl/wosun.scor.vip

# 上传证书文件
# fullchain.pem (证书文件)
# privkey.pem (私钥文件)
```

### 3. 更新Nginx配置

```bash
# 复制配置文件
cp wosun.scor.vip.conf /usr/local/nginx/conf/vhost/

# 测试配置
/usr/local/nginx/sbin/nginx -t

# 重启Nginx
/usr/local/nginx/sbin/nginx -s reload
```

---

## 方式三：使用Certbot

### 1. 安装Certbot

```bash
# CentOS/RHEL
yum install certbot

# Ubuntu/Debian
apt-get install certbot
```

### 2. 申请证书

```bash
# 使用standalone模式（需要临时停止Nginx）
certbot certonly --standalone -d wosun.scor.vip

# 或使用webroot模式（不需要停止Nginx）
certbot certonly --webroot -w /var/www/wosun-website -d wosun.scor.vip
```

### 3. 复制证书到Nginx目录

```bash
# 创建证书目录
mkdir -p /usr/local/nginx/conf/ssl/wosun.scor.vip

# 复制证书
cp /etc/letsencrypt/live/wosun.scor.vip/fullchain.pem /usr/local/nginx/conf/ssl/wosun.scor.vip/
cp /etc/letsencrypt/live/wosun.scor.vip/privkey.pem /usr/local/nginx/conf/ssl/wosun.scor.vip/
```

### 4. 设置自动续期

```bash
# 添加定时任务
crontab -e

# 添加以下内容（每天凌晨2点检查并续期）
0 2 * * * certbot renew --quiet --post-hook "/usr/local/nginx/sbin/nginx -s reload"
```

---

## 验证HTTPS配置

访问 `https://wosun.scor.vip` 检查是否正常。

### 在线检测工具

- SSL Labs: https://www.ssllabs.com/ssltest/
- MySSL: https://myssl.com/

---

## 常见问题

### 1. 证书路径错误

确保证书文件路径正确：
```bash
ls -la /usr/local/nginx/conf/ssl/wosun.scor.vip/
```

### 2. 端口未开放

```bash
# 检查防火墙
firewall-cmd --list-ports

# 开放443端口
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload
```

### 3. 证书权限问题

```bash
chmod 644 /usr/local/nginx/conf/ssl/wosun.scor.vip/fullchain.pem
chmod 600 /usr/local/nginx/conf/ssl/wosun.scor.vip/privkey.pem
```
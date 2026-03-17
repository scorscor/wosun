# 莴笋录屏官方网站

简洁高效的桌面录屏软件官方网站

## 功能特性

- 响应式设计，支持移动端和桌面端
- 用户留言功能，数据存储在本地JSON文件
- 严格的输入验证，防止注入攻击
- 大气简约的设计风格，与软件风格一致

## 安装部署

### 本地开发

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 访问 http://localhost:3000

### 生产部署（Linux服务器）

1. 安装Node.js（建议v16或更高版本）
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. 上传项目文件到服务器
```bash
scp -r * user@your-server:/path/to/wosun-website/
```

3. 在服务器上安装依赖
```bash
cd /path/to/wosun-website
npm install --production
```

4. 使用PM2管理进程（推荐）
```bash
# 安装PM2
sudo npm install -g pm2

# 启动应用
pm2 start server.js --name wosun-website

# 设置开机自启
pm2 startup
pm2 save
```

5. 配置Nginx反向代理（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 环境变量

可以通过环境变量配置端口：

```bash
PORT=8080 npm start
```

## 目录结构

```
wosun-website/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 前端脚本
├── server.js           # 后端服务器
├── package.json        # 项目配置
├── assets/             # 资源文件（需要从source_code复制）
│   ├── wosun.svg       # Logo
│   └── floder.svg      # 文件夹图标
├── data/               # 数据存储目录（自动创建）
│   └── messages.json   # 留言数据
└── README.md           # 说明文档
```

## 注意事项

1. 需要将 `source_code/assets/` 目录复制到网站根目录
2. 确保服务器防火墙开放相应端口（默认3000）
3. 留言数据存储在 `data/messages.json`，建议定期备份
4. 生产环境建议使用Nginx作为反向代理并配置HTTPS

## 作者

抖音搜索：周五不满仓
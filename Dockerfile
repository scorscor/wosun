# 使用Node.js 18官方镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制项目文件
COPY . .

# 创建数据目录
RUN mkdir -p data

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
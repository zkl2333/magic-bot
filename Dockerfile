# 使用Node官方提供的LTS版镜像作为基础镜像
FROM node:lts-alpine

# 将工作目录设为/app，所有的路径都将以/app为基础
WORKDIR /app

# 将你的app的源代码复制到工作目录
COPY . .

# 前端构建
WORKDIR /app/client

# 安装项目依赖
RUN npm ci

# 生成Prisma客户端
RUN npx prisma generate

# 编译TypeScript代码
RUN npm run build

# 后端构建
WORKDIR /app/server

# 将前端构建好的静态文件复制到后端的静态文件目录
RUN cp -r /app/client/dist /app/server/public

# 安装项目依赖
RUN npm ci

# 生成Prisma客户端
RUN npx prisma generate

# 编译TypeScript代码
RUN npm run build

# 让Docker监听你的app所需要的端口
EXPOSE 3000

# 启动你的app
CMD ["/bin/sh", "/app/server/start.sh"]

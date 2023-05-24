# 使用Node官方提供的LTS版镜像作为基础镜像
FROM node:lts

# 将工作目录设为/app，所有的路径都将以/app为基础
WORKDIR /app

# 将package.json 和 package-lock.json(如果有的话)复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将你的app的源代码复制到工作目录
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 编译TypeScript代码
RUN npm run build

# 让Docker监听你的app所需要的端口
EXPOSE 3001

# 启动你的app
CMD [ "node", "dist/index.js" ]

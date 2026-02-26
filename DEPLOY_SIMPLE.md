# 前端项目简化部署文档（无 Nginx 方案）

## 适用场景

前后端在同一台服务器上，通过 FastAPI 直接提供前端静态文件服务。

## 优势

- 无需安装和配置 Nginx
- 只需运行一个服务
- 配置简单，维护方便
- 适合本地虚拟机或开发/测试环境

## 部署步骤

### 1. 构建前端项目

```bash
# 进入前端项目目录
cd /opt/yt-dlp-api-front

# 安装依赖（首次部署）
npm install

# 构建生产版本
npm run build

# 验证构建结果
ls -lh build/
```

构建完成后会生成 `build/` 目录，包含所有静态文件。

### 2. 后端已自动配置

后端代码已经配置好静态文件服务，会自动检测 `yt-dlp-api-front/build` 目录：

- 如果目录存在，自动提供前端服务
- 支持 React Router（所有前端路由返回 index.html）
- API 路由保持在 `/api/*` 路径下

### 3. 重启后端服务

```bash
# 如果使用 systemd 管理
sudo systemctl restart yt-dlp-api

# 或者直接运行
cd /opt/yt-dlp-api
python app/main.py
```

### 4. 验证部署

```bash
# 检查服务状态
sudo systemctl status yt-dlp-api

# 测试前端访问
curl http://localhost:8000/

# 测试 API 访问
curl http://localhost:8000/api/tasks
```

## 访问地址

- **前端页面**: `http://your-server-ip:8000/`
- **任务列表**: `http://your-server-ip:8000/`
- **新建下载**: `http://your-server-ip:8000/download`
- **API 文档**: `http://your-server-ip:8000/docs`
- **API 接口**: `http://your-server-ip:8000/api/*`

## 更新部署

### 自动化部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

set -e

echo "================================"
echo "前端项目自动化部署（无 Nginx）"
echo "================================"
echo ""

# 项目目录
FRONTEND_DIR="/opt/yt-dlp-api-front"
BACKEND_DIR="/opt/yt-dlp-api"

# 1. 更新前端代码
echo "1. 更新前端代码..."
cd $FRONTEND_DIR
git pull origin master

# 2. 安装依赖
echo "2. 安装依赖..."
npm install

# 3. 构建项目
echo "3. 构建前端..."
npm run build

# 4. 检查构建结果
if [ ! -d "$FRONTEND_DIR/build" ]; then
    echo "错误: 构建失败，build 目录不存在"
    exit 1
fi

echo "✓ 前端构建成功"

# 5. 更新后端代码（可选）
echo "4. 更新后端代码..."
cd $BACKEND_DIR
git pull origin master

# 6. 重启后端服务
echo "5. 重启后端服务..."
sudo systemctl restart yt-dlp-api

# 7. 检查服务状态
sleep 2
if sudo systemctl is-active --quiet yt-dlp-api; then
    echo "✓ 服务运行正常"
else
    echo "✗ 服务启动失败"
    sudo systemctl status yt-dlp-api
    exit 1
fi

echo ""
echo "================================"
echo "部署完成！"
echo "================================"
echo "访问地址: http://your-server-ip:8000"
```

### 使用部署脚本

```bash
# 赋予执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

### 手动更新

```bash
# 1. 更新前端代码
cd /opt/yt-dlp-api-front
git pull origin master

# 2. 重新构建
npm install
npm run build

# 3. 重启后端服务
sudo systemctl restart yt-dlp-api
```

## 常见问题

### 1. 前端页面显示空白

**检查构建目录**：
```bash
ls -la /opt/yt-dlp-api-front/build/
```

**检查后端日志**：
```bash
sudo journalctl -u yt-dlp-api -f
```

### 2. API 请求失败

**原因**：前端 API 配置错误

**解决**：前端已配置使用相对路径 `/api`，无需修改

### 3. 路由跳转 404

**原因**：后端未正确处理 React Router

**解决**：确保后端代码已更新，包含 `serve_frontend` 函数

### 4. 静态资源加载失败

**检查文件权限**：
```bash
sudo chown -R $USER:$USER /opt/yt-dlp-api-front/build
chmod -R 755 /opt/yt-dlp-api-front/build
```

## 端口配置

如果需要修改端口，编辑后端配置：

```bash
# 编辑 .env 文件
cd /opt/yt-dlp-api
nano .env

# 修改端口
APP_PORT=8000

# 重启服务
sudo systemctl restart yt-dlp-api
```

## 防火墙配置

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 8000/tcp
sudo ufw reload

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
```

## 性能优化

### 1. 启用 Gzip 压缩

FastAPI 默认支持 Gzip，可以在 `main.py` 中添加：

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### 2. 设置静态文件缓存

修改 `main.py` 中的 StaticFiles 配置：

```python
app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_BUILD_PATH, "static"), html=True), name="static")
```

## 监控和日志

### 查看服务日志

```bash
# 实时查看日志
sudo journalctl -u yt-dlp-api -f

# 查看最近 100 行
sudo journalctl -u yt-dlp-api -n 100

# 查看应用日志
tail -f /opt/yt-dlp-api/logs/app.log
```

## 对比 Nginx 方案

| 特性 | FastAPI 方案 | Nginx 方案 |
|------|-------------|-----------|
| 配置复杂度 | 简单 | 中等 |
| 性能 | 良好 | 优秀 |
| 静态文件缓存 | 基础 | 强大 |
| 负载均衡 | 不支持 | 支持 |
| HTTPS 配置 | 需要额外配置 | 简单 |
| 适用场景 | 开发/测试/小规模 | 生产环境 |

## 总结

这个方案适合：
- ✅ 本地虚拟机环境
- ✅ 开发和测试环境
- ✅ 小规模部署（< 100 并发）
- ✅ 前后端在同一服务器

如果需要更高性能或生产环境部署，建议使用 Nginx 方案（参考 `DEPLOY.md`）。

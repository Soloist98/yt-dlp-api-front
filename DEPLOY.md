# 前端项目部署文档

## 项目信息

- **项目名称**: yt-dlp-api-front
- **技术栈**: React 19 + TypeScript + TailwindCSS
- **构建工具**: React Scripts (Create React App)
- **部署方式**: FastAPI 静态文件服务（推荐）或 Nginx

## 部署方案选择

### 方案一：FastAPI 直接提供静态文件（推荐）

**适用场景**：
- ✅ 前后端在同一台服务器
- ✅ 本地虚拟机或开发/测试环境
- ✅ 小规模部署（< 100 并发用户）
- ✅ 希望简化配置和维护

**优势**：
- 无需安装 Nginx
- 只需运行一个服务
- 配置简单，维护方便
- 自动支持 React Router

**部署架构**：
```
用户浏览器
    ↓
FastAPI (端口 8000)
    ├─ 前端静态文件 (/, /download, /static/*)
    └─ API 接口 (/api/*)
```

### 方案二：Nginx 反向代理（生产环境）

**适用场景**：
- ✅ 生产环境部署
- ✅ 需要高性能静态文件服务
- ✅ 需要负载均衡
- ✅ 需要 HTTPS 和高级缓存策略

**优势**：
- 更高的静态文件服务性能
- 强大的缓存和压缩功能
- 支持负载均衡和反向代理
- 更好的 HTTPS 支持

**部署架构**：
```
用户浏览器
    ↓
Nginx (端口 80/443)
    ↓
静态文件 (/var/www/yt-dlp-api-front)
    ↓
API 代理 (/api → http://localhost:8000)
```

---

## 方案一：FastAPI 部署（推荐）

### 前置要求

- Linux 服务器（Ubuntu/Debian/CentOS）
- Node.js >= 16.x
- Python 3.8+
- Git
- 后端服务已部署在 `/opt/yt-dlp-api`

### 部署步骤

#### 1. 克隆前端项目

```bash
# 创建项目目录
sudo mkdir -p /opt/yt-dlp-api-front
sudo chown $USER:$USER /opt/yt-dlp-api-front

# 克隆项目
cd /opt
git clone <your-git-repo-url> yt-dlp-api-front
cd yt-dlp-api-front
```

#### 2. 安装依赖并构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 验证构建结果
ls -lh build/
```

#### 3. 后端已自动配置

后端代码（`yt-dlp-api/app/main.py`）已配置静态文件服务：
- 自动检测 `../yt-dlp-api-front/build` 目录
- 提供前端静态文件服务
- 支持 React Router
- API 路由在 `/api/*` 路径下

#### 4. 重启后端服务

```bash
# 使用 systemd
sudo systemctl restart yt-dlp-api

# 或直接运行
cd /opt/yt-dlp-api
python app/main.py
```

#### 5. 验证部署

```bash
# 检查服务状态
sudo systemctl status yt-dlp-api

# 测试前端访问
curl http://localhost:8000/

# 测试 API 访问
curl http://localhost:8000/api/tasks
```

### 访问地址

- **前端页面**: `http://your-server-ip:8000/`
- **任务列表**: `http://your-server-ip:8000/`
- **新建下载**: `http://your-server-ip:8000/download`
- **API 文档**: `http://your-server-ip:8000/docs`

### 自动化部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

set -e

echo "================================"
echo "前端项目自动化部署"
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

# 5. 重启后端服务
echo "4. 重启后端服务..."
sudo systemctl restart yt-dlp-api

# 6. 检查服务状态
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

使用部署脚本：

```bash
# 赋予执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

---

## 方案二：Nginx 部署（生产环境）

## 方案二：Nginx 部署（生产环境）

### 前置要求

### 服务器环境
- Linux 服务器（Ubuntu/Debian/CentOS）
- Node.js >= 16.x
- Nginx
- Git

### 检查环境

```bash
# 检查 Node.js 版本
node -v  # 应该 >= 16.x

# 检查 npm 版本
npm -v

# 检查 Nginx
nginx -v

# 如果没有安装，执行以下命令
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm nginx git -y

# CentOS
sudo yum install nodejs npm nginx git -y
```

### 部署步骤

#### 1. 克隆项目到服务器

```bash
# 创建项目目录
sudo mkdir -p /opt/yt-dlp-api-front
sudo chown $USER:$USER /opt/yt-dlp-api-front

# 克隆项目
cd /opt
git clone <your-git-repo-url> yt-dlp-api-front
cd yt-dlp-api-front
```

#### 2. 配置环境变量

```bash
# 创建 .env 文件
cat > .env << 'EOF'
# 后端 API 地址（生产环境）
REACT_APP_API_BASE_URL=http://localhost:8000

# 构建时不生成 source map（减小体积）
GENERATE_SOURCEMAP=false
EOF
```

#### 3. 安装依赖

```bash
# 安装项目依赖
npm install

# 如果遇到权限问题，使用
npm install --unsafe-perm
```

#### 4. 构建生产版本

```bash
# 构建项目
npm run build

# 构建完成后，会生成 build/ 目录
ls -lh build/
```

#### 5. 配置 Nginx

##### 5.1 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/yt-dlp-front
```

##### 5.2 添加以下配置

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器IP

    # 静态文件根目录
    root /opt/yt-dlp-api-front/build;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理到后端
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # React Router 支持（所有路由都返回 index.html）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

##### 5.3 启用配置并重启 Nginx

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/yt-dlp-front /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 设置开机自启
sudo systemctl enable nginx
```

#### 6. 配置防火墙（如果需要）

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

#### 7. 验证部署

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查端口监听
sudo netstat -tlnp | grep :80

# 访问测试
curl http://localhost
```

### Nginx 自动化部署脚本

创建 `deploy-nginx.sh`：

```bash
#!/bin/bash

# Nginx 方案自动化部署脚本

set -e

echo "================================"
echo "前端项目自动化部署（Nginx）"
echo "================================"
echo ""

# 项目目录
PROJECT_DIR="/opt/yt-dlp-api-front"
BUILD_DIR="$PROJECT_DIR/build"
NGINX_CONFIG="/etc/nginx/sites-available/yt-dlp-front"

# 进入项目目录
cd $PROJECT_DIR

# 1. 拉取最新代码
echo "1. 拉取最新代码..."
git pull origin master

# 2. 安装依赖
echo "2. 安装依赖..."
npm install

# 3. 构建项目
echo "3. 构建项目..."
npm run build

# 4. 检查构建结果
if [ ! -d "$BUILD_DIR" ]; then
    echo "错误: 构建失败，build 目录不存在"
    exit 1
fi

echo "✓ 构建成功"

# 5. 重启 Nginx
echo "4. 重启 Nginx..."
sudo systemctl restart nginx

# 6. 检查 Nginx 状态
if sudo systemctl is-active --quiet nginx; then
    echo "✓ Nginx 运行正常"
else
    echo "✗ Nginx 启动失败"
    sudo systemctl status nginx
    exit 1
fi

echo ""
echo "================================"
echo "部署完成！"
echo "================================"
echo "访问地址: http://your-server-ip"
```

使用部署脚本：

```bash
# 赋予执行权限
chmod +x deploy-nginx.sh

# 执行部署
./deploy-nginx.sh
```

---

## HTTPS 配置（可选但推荐）

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS
sudo yum install certbot python3-certbot-nginx -y

# 获取证书并自动配置 Nginx
sudo certbot --nginx -d your-domain.com

# 测试自动续期
sudo certbot renew --dry-run
```

### 手动配置 HTTPS（如果使用自己的证书）

修改 Nginx 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... 其他配置同上 ...
}
```

---

## 常见问题排查

### 1. 页面显示空白

**原因**: 可能是路由配置问题

**方案一（FastAPI）解决**:
```bash
# 检查后端日志
sudo journalctl -u yt-dlp-api -f

# 确认前端构建目录存在
ls -la /opt/yt-dlp-api-front/build/
```

**方案二（Nginx）解决**:
```bash
# 检查 Nginx 配置中的 try_files
# 确保有: try_files $uri $uri/ /index.html;

# 重启 Nginx
sudo systemctl restart nginx
```

### 2. API 请求失败

**原因**: 后端服务未启动或代理配置错误

**解决**:
```bash
# 检查后端服务
sudo systemctl status yt-dlp-api

# 检查后端端口
sudo netstat -tlnp | grep :8000

# 方案二：查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 3. 静态资源 404

**原因**: 构建目录路径不正确

**方案一（FastAPI）解决**:
```bash
# 检查 build 目录
ls -la /opt/yt-dlp-api-front/build/

# 检查后端日志
sudo journalctl -u yt-dlp-api -n 50
```

**方案二（Nginx）解决**:
```bash
# 检查 build 目录
ls -la /opt/yt-dlp-api-front/build/

# 检查 Nginx root 配置
sudo nginx -T | grep root
```

### 4. 权限问题

**原因**: 服务无法访问文件

**方案一（FastAPI）解决**:
```bash
# 修改文件权限
sudo chown -R $USER:$USER /opt/yt-dlp-api-front/build
chmod -R 755 /opt/yt-dlp-api-front/build
```

**方案二（Nginx）解决**:
```bash
# 修改文件权限
sudo chown -R www-data:www-data /opt/yt-dlp-api-front/build
sudo chmod -R 755 /opt/yt-dlp-api-front/build
```

---

## 更新部署

### 方案一：FastAPI 更新

```bash
cd /opt/yt-dlp-api-front

# 拉取最新代码
git pull origin master

# 安装依赖（如果有新依赖）
npm install

# 重新构建
npm run build

# 重启后端服务
sudo systemctl restart yt-dlp-api
```

### 方案二：Nginx 更新

```bash
cd /opt/yt-dlp-api-front

# 拉取最新代码
git pull origin master

# 安装依赖（如果有新依赖）
npm install

# 重新构建
npm run build

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 性能优化建议

### 方案一：FastAPI 优化

在 `yt-dlp-api/app/main.py` 中添加：

```python
from fastapi.middleware.gzip import GZipMiddleware

# 启用 Gzip 压缩
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### 方案二：Nginx 优化

#### 1. 启用 Brotli 压缩（比 Gzip 更高效）

```bash
# 安装 Nginx Brotli 模块
sudo apt install nginx-module-brotli -y

# 在 Nginx 配置中添加
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

#### 2. 配置 CDN（可选）

如果有 CDN 服务，可以将静态资源上传到 CDN，加快全球访问速度。

#### 3. 启用 HTTP/2

```nginx
listen 443 ssl http2;  # 添加 http2
```

---

## 监控和日志

### 方案一：FastAPI 日志

```bash
# 实时查看服务日志
sudo journalctl -u yt-dlp-api -f

# 查看最近 100 行
sudo journalctl -u yt-dlp-api -n 100

# 查看应用日志
tail -f /opt/yt-dlp-api/logs/app.log
```

### 方案二：Nginx 日志

```bash
# 实时查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

Nginx 默认已配置日志轮转，位于 `/etc/logrotate.d/nginx`

---

## 备份策略

### 备份构建产物

```bash
# 创建备份脚本
cat > /opt/yt-dlp-api-front/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/yt-dlp-front"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/build_$DATE.tar.gz -C /opt/yt-dlp-api-front build/

# 只保留最近7天的备份
find $BACKUP_DIR -name "build_*.tar.gz" -mtime +7 -delete
EOF

chmod +x /opt/yt-dlp-api-front/backup.sh
```

---

## 方案对比

| 特性 | 方案一：FastAPI | 方案二：Nginx |
|------|----------------|--------------|
| **配置复杂度** | 简单 | 中等 |
| **性能** | 良好 | 优秀 |
| **静态文件缓存** | 基础 | 强大 |
| **负载均衡** | 不支持 | 支持 |
| **HTTPS 配置** | 需要额外配置 | 简单 |
| **适用场景** | 开发/测试/小规模 | 生产环境 |
| **并发处理** | < 100 用户 | > 1000 用户 |
| **维护成本** | 低 | 中 |

---

## 总结

### 方案一：FastAPI 部署（推荐用于本地虚拟机）

完成以上步骤后，你的前端项目已经通过 FastAPI 成功部署。

**访问地址**: `http://your-server-ip:8000`

**关键文件位置**:
- 项目目录: `/opt/yt-dlp-api-front`
- 构建产物: `/opt/yt-dlp-api-front/build`
- 后端代码: `/opt/yt-dlp-api/app/main.py`
- 部署脚本: `/opt/yt-dlp-api-front/deploy.sh`

### 方案二：Nginx 部署（推荐用于生产环境）

完成以上步骤后，你的前端项目已经通过 Nginx 成功部署。

**访问地址**: `http://your-server-ip` 或 `http://your-domain.com`

**关键文件位置**:
- 项目目录: `/opt/yt-dlp-api-front`
- 构建产物: `/opt/yt-dlp-api-front/build`
- Nginx 配置: `/etc/nginx/sites-available/yt-dlp-front`
- 部署脚本: `/opt/yt-dlp-api-front/deploy-nginx.sh`

如有问题，请查看日志文件或参考常见问题排查章节。

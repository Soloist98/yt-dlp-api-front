# Video Downloader Frontend

一个基于 React + TypeScript 的现代化视频下载管理前端应用，采用 iOS 26 Liquid 设计风格。

## 特性

- 🎨 **Liquid Design**: 流动的玻璃态设计，柔和的渐变和动画
- 📱 **响应式布局**: 完美适配各种屏幕尺寸
- 🔍 **智能搜索**: 支持按状态过滤和关键词搜索
- 📄 **分页展示**: 优雅的分页浏览体验
- 🔄 **自动刷新**: 任务状态实时更新（每3秒）
- ⚡ **快速重试**: 失败任务一键重试
- 🎭 **流畅动画**: Framer Motion 驱动的丝滑动画

## 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式系统
- **Framer Motion** - 动画库
- **React Query** - 数据管理
- **Axios** - HTTP 客户端
- **date-fns** - 日期处理

## 架构设计

遵循 Clean Code 和 SOLID 原则：

```
src/
├── components/       # UI 组件（单一职责）
│   ├── Button.tsx
│   ├── GlassCard.tsx
│   ├── Header.tsx
│   ├── TaskCard.tsx
│   ├── TaskList.tsx
│   ├── FilterBar.tsx
│   ├── StatusBadge.tsx
│   └── DownloadForm.tsx
├── services/         # API 服务层（依赖倒置）
│   └── api.ts
├── hooks/            # 自定义 Hooks（业务逻辑）
│   └── useTasks.ts
├── types/            # TypeScript 类型定义
│   └── task.ts
├── utils/            # 工具函数
│   └── cn.ts
└── App.tsx           # 主应用组件
```

## 快速开始

### 前置要求

- Node.js >= 16
- npm 或 yarn
- 后端服务运行（默认 `http://localhost:8000`）

### 环境配置

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件配置后端地址：

```env
# 后端 API 地址
REACT_APP_API_BASE_URL=http://localhost:8000

# 开发服务器端口
PORT=8002
```

### 安装依赖

```bash
npm install
```

需要额外安装代理中间件：

```bash
npm install --save-dev http-proxy-middleware
```

### 开发模式

```bash
npm start
```

应用将在 `http://localhost:8002` 启动，API 请求自动代理到配置的后端地址。

### 生产构建

```bash
npm run build
```

构建产物将输出到 `build/` 目录。

## 设计理念

### Liquid Design 美学

- **玻璃态效果**: 使用 backdrop-blur 和半透明背景
- **渐变网格**: 多层径向渐变创造深度感
- **流动动画**: 柔和的缓动函数和弹性动画
- **有机形状**: 圆角和曲线元素
- **光影层次**: 精心设计的阴影和高光

### 色彩系统

- 主色调：蓝色 → 紫色渐变
- 强调色：粉色、绿色、红色
- 背景：深色网格渐变（slate-950）
- 文字：白色及其透明度变体

### 动画原则

- 入场动画：淡入 + 上移（stagger effect）
- 悬停效果：轻微缩放（1.02x - 1.05x）
- 加载状态：旋转动画
- 状态变化：平滑过渡（300ms）

## API 集成

前端通过 `/api` 前缀访问后端接口：

- `POST /api/download` - 提交下载任务
- `GET /api/tasks` - 获取任务列表
- `GET /api/task/:id` - 获取单个任务
- `POST /api/batch_download` - 批量下载

## 功能说明

### 任务管理

- **查看任务**: 分页展示所有下载任务
- **搜索过滤**: 按状态（全部/下载中/已完成/失败）和关键词搜索
- **自动刷新**: 任务列表每3秒自动刷新
- **重试下载**: 失败任务可一键重试

### 任务状态

- **pending**: 下载中（显示进度条动画）
- **completed**: 已完成（绿色徽章）
- **failed**: 失败（红色徽章 + 错误信息 + 重试按钮）

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件采用函数式 + Hooks
- CSS 使用 Tailwind 工具类
- 保持组件单一职责
- API 服务层与 UI 层分离

## License

MIT

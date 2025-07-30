# 溯农云链 (Agricultural Traceability Cloud Chain)

一个基于 Vue 3 + Vite 的农产品溯源管理平台，集成区块链技术，为农产品提供全链路溯源服务。

## 🌟 项目特色

- **全链路溯源**: 从种植、加工、物流到检测的完整溯源链条
- **区块链集成**: 基于以太坊的智能合约，确保数据不可篡改
- **多角色管理**: 支持用户查询、管理员后台、农户数据录入
- **扫码查询**: 支持二维码扫描和手动输入查询
- **数据可视化**: 统计分析和图表展示
- **响应式设计**: 支持桌面端和移动端访问

## 🚀 技术栈

### 前端技术

- **框架**: Vue 3 + Composition API
- **构建工具**: Vite 4.x
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **UI 框架**: Tailwind CSS 3.x
- **图标库**: Heroicons Vue
- **HTTP 客户端**: Axios

### 区块链技术

- **以太坊交互**: Ethers.js 6.x
- **智能合约**: Solidity
- **网络支持**: 主网/测试网

### 开发工具

- **代码规范**: ESLint + Vue ESLint Plugin
- **CSS 处理**: PostCSS + Autoprefixer
- **类型检查**: Vue TSC

## 📦 项目结构

```
src/
├── api/                    # API接口层
│   ├── blockchain.js       # 区块链相关接口
│   └── trace.js           # 溯源查询接口
├── components/            # 组件库
│   ├── common/            # 通用组件
│   │   ├── DataTable.vue  # 数据表格
│   │   ├── EditDialog.vue # 编辑对话框
│   │   ├── LoadingSpinner.vue # 加载动画
│   │   └── ConfirmDialog.vue  # 确认对话框
│   ├── layout/            # 布局组件
│   │   ├── SideMenu.vue   # 侧边菜单
│   │   ├── TopBar.vue     # 顶部导航
│   │   └── Breadcrumb.vue # 面包屑导航
│   ├── trace/             # 溯源相关组件
│   │   ├── ScanInput.vue  # 扫码输入
│   │   └── TraceTimeline.vue # 溯源时间轴
│   ├── form/              # 表单组件
│   │   ├── FormInput.vue  # 输入框
│   │   └── FormSelect.vue # 选择框
│   └── index.js           # 组件统一导出
├── constants/             # 常量定义
│   └── index.js          # 路由、API、业务常量
├── layout/               # 页面布局
│   └── AdminLayout.vue   # 管理后台布局
├── router/               # 路由配置
│   └── index.js         # 路由定义和守卫
├── utils/                # 工具函数
│   └── index.js         # 通用工具函数
├── views/                # 页面组件
│   ├── LoginPage.vue     # 登录页面
│   ├── TraceQuery.vue    # 溯源查询
│   ├── AdminHome.vue     # 管理后台首页
│   ├── ProductList.vue   # 产品管理
│   ├── StatisticsPage.vue # 统计分析
│   └── ...
├── style.css             # 全局样式
└── main.js              # 应用入口
```

## 🛠️ 开发环境

### 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **现代浏览器**: Chrome 88+, Firefox 78+, Safari 14+

### 快速开始

1. **克隆项目**

```bash
git clone <repository-url>
cd agricultural-traceability-chain
```

2. **安装依赖**

```bash
npm install
```

3. **环境配置**

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
vim .env
```

4. **启动开发服务器**

```bash
npm run dev
```

5. **访问应用**

```
http://localhost:3000
```

### 可用脚本

```bash
# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run preview

# 代码检查和修复
npm run lint

# 仅检查代码规范
npm run lint:check

# 类型检查
npm run type-check

# 清理缓存
npm run clean
```

## 🎯 功能模块

### 用户端功能

- **🔍 扫码查询**: 支持摄像头扫码和手动输入溯源码
- **📊 溯源展示**: 完整的产品溯源信息时间轴展示
- **🔗 溯源链路**: 种植 → 加工 → 物流 → 检测的完整链路
- **📱 移动适配**: 响应式设计，支持手机端查询

### 管理后台功能

- **📈 数据统计**: 实时统计面板和数据可视化
- **🏷️ 产品管理**: 产品分类、产品列表管理
- **🏭 供应链管理**: 供应商信息和关系管理
- **⚙️ 环节管理**: 溯源环节配置和流程定义
- **🏷️ 赋码管理**: 溯源码生成、分配和管理
- **✅ 数据审核**: 溯源数据审核和质量控制
- **📊 统计分析**: 多维度数据分析和报表生成

### 农户端功能

- **📝 数据录入**: 分步骤录入农产品生产信息
- **📋 数据管理**: 农户数据查看、编辑和历史记录
- **📸 图片上传**: 支持生产过程图片记录

## 🔗 区块链集成

### 智能合约交互

```javascript
// 连接钱包
const { provider, signer, address } = await connectWallet();

// 读取合约数据
const data = await readContract(contractAddress, abi, "getData", [param]);

// 写入合约数据
const tx = await writeContract(contractAddress, abi, "setData", [param]);
await tx.wait(); // 等待交易确认
```

### 支持的网络

- **主网**: Ethereum Mainnet
- **测试网**: Sepolia, Goerli
- **本地网络**: Hardhat, Ganache

## 🎨 界面预览

### 主要页面

- **🔐 登录界面**: 简洁的管理员登录页面
- **🔍 查询界面**: 用户友好的扫码查询界面
- **🏠 管理后台**: 功能完整的后台管理系统
- **📊 数据展示**: 直观的溯源信息时间轴展示
- **📈 统计面板**: 实时数据统计和图表分析

### 设计特点

- **🎨 现代化 UI**: 基于 Tailwind CSS 的现代化设计
- **📱 响应式**: 完美适配桌面端和移动端
- **🌙 深色模式**: 支持深色主题切换（规划中）
- **♿ 无障碍**: 遵循 WCAG 2.1 无障碍设计规范

## 📱 路由结构

```
/                          # 重定向到登录页
├── /login                 # 登录页面
├── /register              # 注册页面
├── /trace
│   ├── /query            # 溯源查询页面
│   ├── /result           # 溯源结果展示
│   ├── /admin            # 管理后台
│   │   ├── /home         # 后台首页
│   │   ├── /category     # 产品分类管理
│   │   ├── /product      # 产品列表管理
│   │   ├── /supply       # 供应链管理
│   │   ├── /trace        # 环节管理
│   │   ├── /code         # 赋码管理
│   │   ├── /audit        # 数据审核
│   │   └── /statistics   # 统计分析
│   └── /farmer
│       ├── /add          # 农户数据录入
│       └── /manage       # 农户数据管理
```

## ⚙️ 配置说明

### 环境变量

```bash
# 应用配置
VITE_APP_TITLE=溯农云链
VITE_APP_VERSION=1.0.0

# API 配置
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000

# 区块链配置
VITE_BLOCKCHAIN_NETWORK=localhost
VITE_CONTRACT_ADDRESS=0x...
```

### Vite 配置

- **路径别名**: 配置了 `@`、`@components` 等便捷路径
- **代理设置**: API 请求代理到后端服务
- **构建优化**: 代码分割和依赖优化
- **开发服务器**: 热重载和错误提示

### Tailwind CSS

- **自定义主题**: 扩展了农业相关的绿色主题色彩
- **响应式断点**: 针对不同设备的断点设置
- **组件类**: 预定义的组件样式类

## 🧪 测试

### 测试账号

```
管理员账号: admin
密码: 123456
```

### 测试数据

项目包含模拟的测试数据，包括：

- 产品信息和分类
- 溯源记录和时间轴
- 统计数据和图表
- 农户信息和生产记录

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

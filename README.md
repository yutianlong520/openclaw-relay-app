# OpenClaw 中转助手 🦞

> 📱 使用 UniApp + Vue 3 开发的移动端应用，让你用手机控制本地 OpenClaw！

[![GitHub stars](https://img.shields.io/github/stars/yutianlong520/openclaw-relay-app)](https://github.com/yutianlong520/openclaw-relay-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yutianlong520/openclaw-relay-app)](https://github.com/yutianlong520/openclaw-relay-app/network)
[![License](https://img.shields.io/github/license/yutianlong520/openclaw-relay-app)](https://github.com/yutianlong520/openclaw-relay-app/blob/main/LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join-blue)](https://discord.gg/openclaw)

## ⭐ 特性

- 📱 **跨平台** - 一套代码同时支持 iOS、Android、H5
- 💬 **实时聊天** - 通过 WebSocket 与本地 OpenClaw 实时通信
- 🖥️ **设备管理** - 管理多个本地 OpenClaw 实例
- 🔒 **安全连接** - API Key 认证，保护你的数据
- 🔄 **自动重连** - 网络波动时自动重连
- 🎨 **精美 UI** - 简洁现代的界面设计

## 📖 文档

- [前端使用手册](./文档/前端使用手册.md) - App 使用说明
- [用户手册](./文档/用户手册.md) - 完整使用指南
- [后端接口文档](./后端/openclaw-relay-server/文档/后端接口文档.md) - API 接口说明

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yutianlong520/openclaw-relay-app.git
cd openclaw-relay-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置服务器地址

在 `src/services/websocket.ts` 中修改服务器地址：

```typescript
const API_BASE_URL = 'https://your-server.com'
```

或在应用设置页面中输入。

### 4. 运行开发服务器

```bash
# H5 开发
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# App 开发
npm run dev:app
```

### 5. 构建发布

```bash
# 构建 H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin

# 构建 App
npm run build:app
```

## 📖 使用指南

### 首次使用

1. **启动中转服务器** - 请参考 [openclaw-relay-server](https://github.com/yutianlong520/openclaw-relay-server)
2. **配置服务器地址** - 在设置页面填写你的服务器地址
3. **获取 API Key** - 在服务器管理后台生成 API Key
4. **输入 API Key** - 在设置页面填写 API Key
5. **开始使用** - 连接成功后即可与本地 OpenClaw 聊天

### 设备绑定

1. 在本地 OpenClaw 插件中生成绑定二维码
2. 在手机 App 中扫描二维码
3. 设备绑定成功后即可在设备列表中看到

### 发送消息

1. 在设备列表中选择要通信的设备
2. 切换到聊天页面
3. 输入消息并发送

## 📁 项目结构

```
openclaw-relay-app/
├── src/
│   ├── pages/              # 页面目录
│   │   ├── index/         # 设备列表页面
│   │   ├── chat/         # 聊天页面
│   │   └── settings/     # 设置页面
│   ├── components/       # 组件目录
│   │   ├── ChatList.vue      # 消息列表
│   │   ├── ChatInput.vue     # 消息输入
│   │   ├── MessageBubble.vue # 消息气泡
│   │   ├── ConnectionStatus.vue # 连接状态
│   │   └── DeviceCard.vue    # 设备卡片
│   ├── stores/           # 状态管理 (Pinia)
│   │   ├── user.ts       # 用户状态
│   │   ├── chat.ts       # 聊天状态
│   │   └── connection.ts # 连接状态
│   ├── services/         # 服务层
│   │   ├── websocket.ts  # WebSocket 服务
│   │   ├── auth.ts       # 认证服务
│   │   └── api.ts        # API 服务
│   └── utils/            # 工具函数
│       ├── storage.ts    # 本地存储
│       ├── logger.ts     # 日志工具
│       └── crypto.ts     # 加密工具
├── static/               # 静态资源
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🔧 技术栈

- **框架**: [UniApp](https://uniapp.dcloud.net.cn/) + [Vue 3](https://vuejs.org/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **语言**: TypeScript

## 🖼️ 界面预览

| 首页（设备列表） | 聊天页面 | 设置页面 |
|-----------------|---------|---------|
| 🖥️ 设备卡片展示 | 💬 消息气泡 | ⚙️ 配置项 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 了解更多。

## 📞 联系

- GitHub: [https://github.com/yutianlong520/openclaw-relay-app](https://github.com/yutianlong520/openclaw-relay-app)
- 问题反馈: [https://github.com/yutianlong520/openclaw-relay-app/issues](https://github.com/yutianlong520/openclaw-relay-app/issues)

---

Made with ❤️ by 牛牛开发团队

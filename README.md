# 🌳 情绪树洞智能体

一个帮助用户根据情绪状态推荐放松场所的智能应用。

## ✨ 功能特点

- 🎭 **情绪识别**：支持多种情绪标签选择（焦虑、疲惫、烦躁、低落、压力大）
- 📍 **位置服务**：自动获取用户当前位置
- 🏪 **智能推荐**：根据情绪和位置推荐最合适的放松场所
- 🗺️ **地图展示**：在地图上直观显示推荐场所
- 💬 **聊天互动**：智能聊天机器人提供情感支持

## 🛠️ 技术栈

- Vue 3 + TypeScript
- Vite 构建工具
- 高德地图 API
- SCSS 样式

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置高德地图 API Key

1. 访问 [高德地图开放平台](https://lbs.amap.com/)
2. 注册账号并创建应用
3. 获取 API Key
4. 在 `src/config/amap.ts` 中配置你的 API Key：

```typescript
export const AMAP_CONFIG = {
  key: 'YOUR_AMAP_API_KEY',  // 替换为你的 API Key
  version: '2.0',
  plugins: ['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Map']
}
```

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
.
├── index.html              # HTML 入口文件
├── package.json            # 项目依赖配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── src/
│   ├── main.ts             # 应用入口
│   ├── App.vue             # 根组件
│   ├── style.css           # 全局样式
│   ├── components/         # 组件目录
│   │   ├── EmotionInput.vue    # 情绪输入组件
│   │   ├── PlaceList.vue       # 场所列表组件
│   │   ├── MapView.vue         # 地图视图组件
│   │   └── Chatbot.vue         # 聊天机器人组件
│   ├── services/           # 服务层
│   │   └── amap.ts             # 高德地图服务
│   └── config/             # 配置文件
│       └── amap.ts             # 高德地图配置
└── public/                 # 静态资源
    └── vite.svg            # 图标文件
```

## 📖 使用说明

1. **选择情绪**：点击对应的情绪标签表达当前心情
2. **描述感受**（可选）：可以输入文字描述你的心情
3. **获取推荐**：点击"开始探索"按钮，系统会根据你的情绪和位置推荐放松场所
4. **查看地图**：点击"在地图上查看"可以在地图上直观看到所有推荐场所

## 🎯 情绪与推荐场所对应关系

| 情绪 | 推荐场所类型 |
|------|------------|
| 😰 焦虑 | 公园、咖啡馆、书店、瑜伽馆、冥想空间 |
| 😫 疲惫 | 温泉、按摩店、足浴、SPA、安静的咖啡馆 |
| 😤 烦躁 | 公园、湖边、森林、健身房、跑步路线 |
| 😔 低落 | 美术馆、音乐厅、展览、植物园、海边 |
| 😣 压力大 | 公园、咖啡馆、茶馆、图书馆、电影院 |

## 📝 License

MIT License
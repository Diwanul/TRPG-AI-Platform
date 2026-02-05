# TRPG AI Platform - 一个 AI 驱动的 TRPG 游戏 IDE

![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Planning-yellow)
![Phase](https://img.shields.io/badge/Phase-1%2FMVP-blue)

## 📖 项目概述

TRPG AI Platform 是一个轻量级、免费、开源的 TRPG（角色扮演游戏）平台。它不仅仅是一个游戏工具，而是一个完整的 **游戏 IDE**，结合了：

- 🎮 **游戏界面** - 沉浸式的游戏环境
- 🤖 **AI DM** - 由 AI 驱动的游戏主持人
- 📚 **外置记忆系统** - 完整的游戏历史和角色档案
- 📚 **资源集成** - 规则、怪物、法术等资源库

### 核心理念

```
编辑器 + 编译器 = IDE
UI + AI + 资源 = TRPG IDE
```

通过 **Prompt Engineering** 和 **AI**，我们将游戏逻辑从代码中解放出来，让游戏具有无限的自由度。

---

## ✨ 关键特性

### 1. 🎯 IDE 概念
- 不仅仅是游戏工具，而是完整的创意空间
- 集成了记忆系统、资源库和游戏界面

### 2. 🤖 AI 驱动设计
- 游戏逻辑由 Prompt 而非代码驱动
- 新增功能 = 新增 Prompt，不是新增代码

### 3. 📝 外置记忆系统
- AI 永不遗忘，故事连贯一致
- 玩家能回顾和分析完整游戏历史
- 支持时间线、关系图、统计分析

### 4. 💰 零成本部署
- GitHub Pages（免费）
- 用户自提供 API Key（零平台成本）
- 所有依赖开源免费

### 5. ♾️ 无限可扩展性
- 支持任意规则系统（D&D, COC, Pathfinder 等）
- 支持任意游戏风格（严肃、幽默、沙盒等）
- 社区可贡献优化的 Prompt

---

## 📁 项目结构

```
TRPG-AI-Platform/
├── 📄 README.md                    # 你在这里
├── 📄 00_START_HERE.md            # 【从这里开始】项目导航
├── 📄 TRPG_AI_Platform_Plan.md    # 【架构设计】完整方案规划
├── 📄 PROMPTS.md                  # 【核心内容】DM Prompt 库
├── 📄 RESOURCES.md                # 【资源集成】开源项目指南
├── 📄 IMPLEMENTATION_GUIDE.md     # 【编码指南】1000+ 行代码
├── 📄 QUICK_REFERENCE.md          # 【快速查询】参考卡片
├── 📄 DELIVERY_CHECKLIST.md       # 【交付清单】内容总结
└── 📄 START.sh                    # 启动脚本

后续将添加：
├── src/                           # 前端代码（Vue 3 + Vite）
├── public/                        # 静态资源和数据
├── docs/                          # 完整文档
├── .github/                       # GitHub 配置
└── package.json                   # 项目配置
```

---

## 🚀 快速开始

### 第一步：了解项目
打开 [`00_START_HERE.md`](./00_START_HERE.md) 获取完整导航。

### 第二步：理解架构
阅读 [`TRPG_AI_Platform_Plan.md`](./TRPG_AI_Platform_Plan.md) 理解 IDE 概念和技术栈。

### 第三步：学习 Prompt 系统
查看 [`PROMPTS.md`](./PROMPTS.md) 了解 DM Prompt 的完整系统（可直接使用）。

### 第四步：开始编码
跟随 [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) 进行开发（包含 1000+ 行现成代码）。

### 第五步：快速查询
使用 [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) 作为日常参考。

---

## 📊 项目现状

| 内容 | 状态 | 进度 |
|------|------|------|
| 方案规划 | ✅ 完成 | 100% |
| Prompt 系统 | ✅ 完成 | 100% |
| 资源研究 | ✅ 完成 | 100% |
| 实现指南 | ✅ 完成 | 100% |
| 文档完成度 | ✅ 完成 | 100% |
| 代码实现 | ⏳ 进行中 | 0% |
| 测试 | ⏳ 待开始 | 0% |
| 部署 | ⏳ 待开始 | 0% |

---

## 🎯 开发阶段

### Phase 1: MVP（最小可行产品）- 1-2 周
**目标**：一个能玩且能记忆的基础版本

- [ ] 项目初始化（Vue 3 + Vite）
- [ ] AI 集成（OpenAI API）
- [ ] 游戏循环（输入 → AI → 输出）
- [ ] 记忆引擎（IndexedDB）
- [ ] 角色卡（Markdown）
- [ ] GitHub Pages 部署

### Phase 2: 体验优化 - 1-2 周
- [ ] Prompt 优化
- [ ] 记忆库 UI
- [ ] 搜索和过滤
- [ ] 资源链接

### Phase 3: 扩展功能 - 可选
- [ ] 多人游戏支持
- [ ] 其他规则系统
- [ ] 本地 Ollama 集成
- [ ] 社区功能

---

## 💡 核心创新点

### 1. 外置记忆系统
不仅保存游戏进度，还记录：
- 完整的对话历史
- NPC 关系和承诺
- 玩家决策树
- AI 推理过程

### 2. AI 驱动的游戏逻辑
```
传统方法：代码 → 游戏规则（维护困难）
AI 方法：Prompt → 无限可能（易于扩展）
```

### 3. Prompt 社区库
用户可以：
- 上传优化的 Prompt
- 分享游戏经验
- 创建自定义系统
- 评分和改进

---

## 🔧 技术栈

```
前端框架：Vue 3 + Vite + TypeScript
状态管理：Pinia
数据存储：IndexedDB
样式：自定义 CSS（或 Tailwind）
部署：GitHub Pages + GitHub Actions
AI：OpenAI API / Claude API
```

---

## 📚 包含的内容

### 文档（30,000+ 字）
- ✅ 完整的方案规划（6000+ 字）
- ✅ 可直接使用的 DM Prompt 库（10,000+ 字）
- ✅ 开源资源集成指南（5000+ 字）
- ✅ 详细的实现步骤（5000+ 字）
- ✅ 快速参考卡片

### 代码示例（1000+ 行）
- ✅ AI 服务层
- ✅ 记忆引擎
- ✅ 状态管理
- ✅ UI 组件
- ✅ 路由配置

### 资源研究
- ✅ 30+ 个可集成的开源项目
- ✅ API 端点和集成方法
- ✅ 优先级和实施计划

---

## 🎓 学习路径

```
1. 理解 IDE 概念（30 分钟）
   ↓
2. 学习 Prompt 系统（1-2 小时）
   ↓
3. 环境和工具准备（30 分钟）
   ↓
4. 编码 MVP（3-5 天）
   ↓
5. 测试和部署（2-3 天）
   ↓
6. 资源集成和优化（可选）
```

---

## 💾 成本分析

| 服务 | 成本 | 说明 |
|------|------|------|
| GitHub Pages | $0 | 免费托管 |
| GitHub Actions | $0 | 免费 CI/CD |
| OpenAI API | 用户自付 | 按使用付费 |
| 域名 | $0 | 可用免费方案 |
| **总计** | **$0** | 平台成本为零 |

---

## 🔗 关键链接

### 文档
- [项目导航](./00_START_HERE.md) - 从这里开始
- [架构设计](./TRPG_AI_Platform_Plan.md) - 技术方案
- [Prompt 系统](./PROMPTS.md) - DM Prompt 库
- [资源指南](./RESOURCES.md) - 开源项目整合
- [编码指南](./IMPLEMENTATION_GUIDE.md) - 实现步骤
- [快速查询](./QUICK_REFERENCE.md) - 参考卡片

### 外部资源
- [D&D 5e API](https://www.dnd5eapi.co/)
- [BCDice](https://github.com/bcdice/BCDice)
- [Archmagi（AI DM 参考）](https://github.com/0xDarkMatter/archmagi)
- [5etools 数据](https://github.com/TheGiddyLimit/5etools-mirror-1)

---

## 🤝 贡献指南

欢迎贡献！你可以：

1. **贡献 Prompt**
   - 优化现有 Prompt
   - 创建新的游戏风格
   - 添加新的规则系统

2. **贡献代码**
   - Bug 修复
   - 功能实现
   - UI 优化

3. **贡献资源**
   - 添加新的数据源
   - 创建资源集成
   - 翻译文档

4. **贡献反馈**
   - 报告 Bug
   - 建议改进
   - 分享体验

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)（待创建）

---

## 📜 许可证

MIT License - 完全开源，可自由使用、修改和分发

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

详见 [LICENSE](./LICENSE)（待创建）

---

## 🎯 Roadmap

### 现在（Phase 1）
- ✅ 文档和规划（完成）
- ⏳ MVP 开发（进行中）

### 近期（2-3 周）
- ⏳ 记忆系统优化
- ⏳ 资源集成
- ⏳ UI 完善

### 中期（1-2 个月）
- ⏳ 多人游戏支持
- ⏳ 更多规则系统
- ⏳ 社区功能

### 长期（3+ 个月）
- ⏳ Ollama 本地 LLM 支持
- ⏳ 高级分析和可视化
- ⏳ 商业化方案

---

## 🆘 获得帮助

### 问题：不知道从哪开始
→ 打开 [`00_START_HERE.md`](./00_START_HERE.md)

### 问题：Prompt 怎么写
→ 查看 [`PROMPTS.md`](./PROMPTS.md) 的完整示例

### 问题：代码怎么写
→ 跟随 [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md)

### 问题：资源如何集成
→ 参考 [`RESOURCES.md`](./RESOURCES.md)

### 问题：快速查询某个概念
→ 使用 [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md)

---

## 📊 项目统计

- 📄 **文档总量**：30,000+ 字
- 💻 **代码样本**：1,000+ 行
- 🔗 **资源项目**：30+ 个
- 📋 **Prompt 数量**：10+ 个完整 Prompt
- ⏱️ **预计 MVP 时间**：1-2 周
- 💰 **平台成本**：$0

---

## ✨ 特别感谢

- 所有开源 TRPG 项目的贡献者
- D&D 社区的设计启发
- OpenAI 和 Anthropic 的 AI 技术

---

## 🎉 关键特点一览

| 特点 | 说明 |
|------|------|
| 🎮 **IDE 设计** | 游戏界面 + 记忆 + 资源的统一环境 |
| 🤖 **AI 驱动** | Prompt Engineering 核心，零 hardcode |
| 📚 **外置记忆** | 完整的游戏历史，玩家和 AI 都能访问 |
| 💰 **零成本** | GitHub Pages + 用户 API Key |
| ♾️ **无限扩展** | 任意规则系统，任意游戏风格 |
| 📖 **完整文档** | 30,000+ 字，包含所有详细信息 |
| 💻 **现成代码** | 1000+ 行，可直接使用 |
| 🔗 **资源集成** | 30+ 开源项目研究 |

---

## 🚀 现在就开始

1. **打开** [`00_START_HERE.md`](./00_START_HERE.md)
2. **阅读** [`TRPG_AI_Platform_Plan.md`](./TRPG_AI_Platform_Plan.md)
3. **学习** [`PROMPTS.md`](./PROMPTS.md)
4. **编码** [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md)

---

**祝你开发顺利！这将是一个非常有趣的项目！🎲✨**

---

## 📞 反馈和支持

- 📧 反馈和建议
- 🐛 报告 Bug
- 💡 功能请求
- 🤝 贡献代码

欢迎所有形式的反馈和贡献！

---

**TRPG AI Platform - 让 AI 成为你的游戏主持人！**

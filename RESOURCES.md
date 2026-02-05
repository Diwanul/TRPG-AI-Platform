# TRPG AI 资源集成指南

本文档列出了可集成到平台中的开源 TRPG 资源项目和 API。

---

## 一、核心资源项目

### 1.1 D&D 5e SRD（系统参考文档）

#### 项目 1: srd5 / benwebber
- **GitHub**: https://github.com/benwebber/srd5
- **说明**: 从 D&D 5e SRD 导出数据的 Python 工具
- **资源类型**: JSON 格式的怪物、法术、物品等
- **集成方式**: 
  - 下载 JSON 数据
  - 建立本地索引
  - 在游戏过程中快速查询
- **许可证**: 开源

#### 项目 2: dnd-srd-mongo / dmtr-karan
- **GitHub**: https://github.com/dmtr-karan/dnd-srd-mongo
- **说明**: D&D 5e SRD 类数据的 MongoDB 管道
- **资源类型**: 职业、子类、特性等
- **集成方式**:
  - JSON Schema 验证
  - 可直接导入我们的资源库

#### 项目 3: 5etools 数据导出
- **来源**: 5etools.com 提供的开源数据
- **资源类型**: 完整的怪物、法术、背景、种族等
- **集成方式**:
  - 从 5etools 的 GitHub repo 下载 JSON
  - 建立搜索索引

---

## 二、骰子和规则系统

### 2.1 BCDice 和 BCDice-API

#### 项目: BCDice
- **GitHub**: https://github.com/bcdice/BCDice
- **说明**: 最受欢迎的日本 TRPG 骰子引擎，支持多个系统
- **支持的系统**:
  - D&D 5e
  - Pathfinder
  - Call of Cthulhu
  - World of Darkness
  - 和 50+ 其他系统
- **集成方式**:
  - 直接调用 BCDice-API（https://github.com/bcdice/bcdice-api）
  - 或在本地部署 BCDice
  - API 端点: 用于骰子掷骰
- **API 示例**:
  ```
  GET /api/v2/game_system
  POST /api/v2/roll?gameSystem=DnD5e&command=1d20+5
  ```

---

## 三、AI 和 DM 相关项目

### 3.1 Archmagi - AI-Powered DM

#### 项目: archmagi
- **GitHub**: https://github.com/0xDarkMatter/archmagi
- **说明**: AI 驱动的 D&D 5e DM 系统，具有自适应叙事引擎和战斗追踪
- **特点**:
  - 使用 Claude API
  - 自适应难度
  - 战斗管理
  - 文学级故事讲述
- **学习价值**: 
  - Prompt engineering 示例
  - 如何集成 Claude API
  - 记忆管理实现

### 3.2 5e-cursor

#### 项目: 5e-cursor
- **GitHub**: https://github.com/frobones/5e-cursor
- **说明**: 使用 Cursor AI IDE 运行 D&D 活动的工具，集成 5etools 数据
- **特点**:
  - 5etools 数据到 Markdown 的转换
  - AI 辅助战役管理
- **集成方式**: 学习他们的数据转换流程

### 3.3 natural20-rag

#### 项目: natural20-rag
- **GitHub**: https://github.com/bazingiu/natural20-rag
- **说明**: RAG 基础的 D&D 5e AI 助手，使用 LlamaIndex 和本地 Ollama
- **技术栈**:
  - Python
  - LlamaIndex
  - Ollama（本地 LLM）
  - Qdrant（向量数据库）
- **集成方式**: 
  - 学习 RAG 架构
  - 本地 Ollama 支持（可选功能）

---

## 四、工具和实用程序

### 4.1 骰子滚轴工具

#### DiceMaiden / DiceMaiden-rs
- **GitHub**: https://github.com/Humblemonk/DiceMaiden
- **说明**: Discord 骰子机器人
- **集成方式**: 查看骰子掷骰的实现方式

#### DiscordDiceBot
- **GitHub**: https://github.com/twonirwana/DiscordDiceBot
- **说明**: 带有图形骰子显示的 Discord 骰子滚轴
- **集成方式**: UI 灵感

### 4.2 角色创建工具

#### DnD_AI_Character_Creator
- **GitHub**: https://github.com/Elfi91/DnD_AI_Character_Creator
- **说明**: 使用 Google Gemini 生成 D&D 5e 角色
- **集成方式**:
  - AI 驱动的角色生成 Prompt
  - 可选功能

#### 5e-monster-maker
- **GitHub**: https://github.com/ebshimizu/5e-monster-maker
- **说明**: D&D 5e 怪物构建器和 CR 计算器
- **集成方式**: 
  - 怪物生成资源
  - UI 布局灵感（Vue）

---

## 五、会话工具

### 5.1 Flocon - TRPG 会话工具

#### 项目: Flocon
- **GitHub**: https://github.com/flocon-trpg/servers
- **说明**: 自托管、多功能的 TRPG 在线会话工具
- **特点**:
  - 地图和角色管理
  - 实时协作
  - 开源和自托管
- **技术**: React, TypeScript
- **学习价值**: 实时会话管理的架构

### 5.2 其他会话工具

#### Saider
- **GitHub**: https://github.com/ysakasin/saider
- **说明**: TRPG 在线语音会话应用
- **特点**: WebSocket 实时通信

---

## 六、骰子机器人和 API

### 6.1 海豹骰（中文）

#### 项目: sealdice-core
- **GitHub**: https://github.com/sealdice/sealdice-core
- **说明**: 新一代 TRPG 骰子机器人，支持多个 IM 平台
- **特点**:
  - 轻量易用
  - 支持多个聊天平台
  - 丰富的规则支持
- **技术**: Go
- **集成方式**: 学习其骰子处理系统

---

## 七、资源集成策略

### 7.1 初期集成清单

**Phase 1（MVP）**:
- [ ] BCDice-API 集成（骰子掷骰）
- [ ] 基础的 5e SRD 数据索引（怪物、法术）
- [ ] 简单的资源链接页面

**Phase 2**:
- [ ] 完整的 5etools 数据导入
- [ ] 搜索和过滤界面
- [ ] 资源与游戏的联动

**Phase 3**:
- [ ] 其他规则系统的资源
- [ ] 社区资源贡献系统
- [ ] 本地 Ollama 集成（可选）

### 7.2 数据格式标准

```json
// 统一的资源条目格式
{
  "id": "unique-id",
  "type": "spell | monster | item | rule | npc-template",
  "name": "法术/怪物名称",
  "system": "dnd5e | coc | pathfinder",
  "description": "简短描述",
  "details": {
    // 详细信息，因类型而异
  },
  "source": "5e-srd",
  "searchKeywords": ["关键词"],
  "relatedResources": ["resource-id-1", "resource-id-2"]
}
```

### 7.3 资源索引建立

```
resources/
├── dnd5e/
│   ├── monsters.json      (怪物索引)
│   ├── spells.json        (法术索引)
│   ├── items.json         (物品索引)
│   └── rules.json         (规则摘要)
├── coc/
│   ├── creatures.json
│   └── spells.json
└── index.json             (全局索引和搜索)
```

---

## 八、API 和在线资源

### 8.1 D&D 5e API

#### D&D 5e API
- **URL**: https://www.dnd5eapi.co/
- **说明**: 免费的 REST API，提供完整的 5e 数据
- **优点**: 无需认证，完全免费
- **缺点**: 可能有速率限制
- **集成方式**: 直接调用 API 获取资源

```
GET https://www.dnd5eapi.co/api/monsters
GET https://www.dnd5eapi.co/api/spells
GET https://www.dnd5eapi.co/api/equipment
```

### 8.2 本地开发资源

#### 5etools 数据
- **来源**: https://github.com/TheGiddyLimit/5etools-mirror-1
- **说明**: 5etools 网站的开源数据镜像
- **优点**: 完整且详细
- **集成**: 直接下载 JSON 文件

---

## 九、许可证注意事项

### 9.1 D&D 5e SRD

- **Open Game License (OGL)**: 允许使用
- **限制**: 某些内容（如专有名称）受限制
- **推荐**: 使用 SRD 内容，避免专有扩展内容

### 9.2 开源项目许可

大多数项目使用：
- MIT
- Apache 2.0
- GPL
- CC-BY-SA（内容）

**最佳实践**: 在资源集成时明确标注来源和许可证

---

## 十、快速集成清单

### 10.1 立即可用

- [ ] BCDice-API（骰子）
- [ ] D&D 5e API（实时数据）
- [ ] 基础资源链接页面

### 10.2 需要数据处理

- [ ] 5etools 数据导入
- [ ] 本地搜索索引
- [ ] 资源预处理和验证

### 10.3 未来增强

- [ ] 其他系统资源
- [ ] 社区贡献系统
- [ ] AI 驱动的资源建议

---

## 十一、资源中心页面设计

```
【资源中心】

┌─────────────────────────────────┐
│ 搜索资源                         │
└─────────────────────────────────┘

【规则和系统】
- D&D 5e SRD
  - 怪物列表
  - 法术列表
  - 物品和装备
  - 规则快速参考

【工具】
- 骰子掷骰器
- 怪物生成器
- 随机遭遇生成

【社区资源】
- 优化的 Prompt（社区分享）
- 模组和冒险模板
- 用户创建的资源

【外部链接】
- 官方规则书
- 在线工具
- 社区论坛
```

---

## 十二、后续研究方向

1. **Ruleset 扩展**: COC、Pathfinder、其他系统的资源
2. **模块化架构**: 易于添加新的资源类型
3. **智能推荐**: AI 根据当前游戏建议相关资源
4. **版本控制**: 当规则更新时自动同步

---

**维护者注**: 这份列表应定期更新新发现的资源和项目。

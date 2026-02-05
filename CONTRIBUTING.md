# 贡献指南

欢迎贡献！我们热烈欢迎所有形式的贡献。

## 贡献类型

### 1. 贡献 Prompt
- 优化现有 DM Prompt
- 创建新的游戏风格变体（严肃、幽默、沙盒等）
- 添加新的规则系统支持（COC、Pathfinder 等）

**提交方式**：
- 在 `PROMPTS.md` 中添加你的 Prompt
- 包含测试用例和使用示例
- 在 PR 中描述 Prompt 的目的和特点

### 2. 贡献代码
- 修复 Bug
- 实现新功能
- 优化性能
- 改进 UI/UX

**提交方式**：
- Fork 仓库
- 创建功能分支：`git checkout -b feature/你的功能名`
- 提交清晰的 Commit
- 发起 Pull Request

### 3. 贡献资源
- 添加新的数据源集成
- 创建资源适配器
- 翻译文档

**提交方式**：
- 更新 `RESOURCES.md`
- 提供集成说明
- 包含示例代码

### 4. 贡献反馈
- 报告 Bug
- 建议改进
- 分享使用体验

**提交方式**：
- 提交 Issue
- 描述清楚问题或建议
- 附加相关信息（操作系统、浏览器等）

---

## 开发流程

### 本地开发设置

```bash
# Clone 仓库
git clone https://github.com/Diwanul/TRPG-AI-Platform.git
cd TRPG-AI-Platform

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 提交 Commit

使用清晰的 Commit 信息：

```
feat: 添加新 DM Prompt 变体
fix: 修复内存引擎的 bug
docs: 更新实现指南
refactor: 优化 AI 服务层
test: 添加内存系统测试
```

### 发起 Pull Request

1. 确保你的代码符合项目风格
2. 写清楚 PR 描述：
   - 做了什么
   - 为什么做
   - 如何测试
3. 等待审核反馈

---

## 代码规范

### JavaScript/TypeScript
- 使用 2 空格缩进
- 使用 `const` 和 `let`，避免 `var`
- 函数名和变量名使用 camelCase
- 类名使用 PascalCase

### Vue 组件
- 使用组合式 API（Composition API）
- 单文件组件使用 `.vue` 扩展名
- Props 和 Emits 明确定义

### Markdown 文档
- 使用清晰的标题结构
- 代码块标注语言类型
- 重要内容使用粗体或块引用

---

## 行为守则

我们致力于提供一个热情、包容的社区。请：

- 尊重他人的意见
- 接受建设性批评
- 友好对待新手
- 避免任何骚扰或歧视行为

任何违反本守则的行为都会被处理。

---

## 问题和建议

- **Bug 报告**：请描述如何复现问题
- **功能请求**：解释你的用例
- **文档改进**：指出不清楚的地方

---

## 许可证

你的贡献将在 MIT 许可证下发布。

---

感谢你的贡献！🎉

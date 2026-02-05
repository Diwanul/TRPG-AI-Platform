# Phase 1 实现指南

从零开始构建 TRPG AI IDE 的完整步骤。

---

## 一、前置准备

### 1.1 环境要求

```
- Node.js 18+ 或 20 LTS
- npm 或 pnpm
- Git
- GitHub 账户
- OpenAI API Key 或 Claude API Key（用户提供）
```

### 1.2 项目初始化

```bash
# 创建项目目录
mkdir TRPG-AI-Platform
cd TRPG-AI-Platform

# 初始化 Git
git init

# 创建 README
echo "# TRPG AI Platform - An IDE for Tabletop RPG" > README.md

# 初始化 npm
npm init -y

# 安装核心依赖
npm install vue@latest vite@latest axios pinia vue-router
npm install --save-dev typescript @vitejs/plugin-vue
```

---

## 二、项目结构构建

```bash
# 创建目录结构
mkdir -p src/{components,views,stores,utils,prompts,assets}
mkdir -p public
mkdir -p docs
mkdir -p .github/workflows
```

### 2.1 Vite 配置

创建 `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
```

### 2.2 Vue App 初始化

创建 `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

创建 `src/App.vue`:

```vue
<template>
  <div id="app">
    <header>
      <h1>TRPG AI IDE</h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/game">游戏</router-link>
        <router-link to="/memories">记忆库</router-link>
        <router-link to="/resources">资源</router-link>
        <router-link to="/settings">设置</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
header {
  background: #1e1e2e;
  color: white;
  padding: 1rem;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}

nav a:hover {
  color: #58a6ff;
}

main {
  padding: 2rem;
}
</style>
```

---

## 三、核心系统实现

### 3.1 AI 服务层

创建 `src/utils/aiService.ts`:

```typescript
interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  tokens: number
}

export class AIService {
  private apiKey: string
  private model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' = 'gpt-3.5-turbo'
  private baseURL = 'https://api.openai.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async callDM(
    messages: Message[],
    systemPrompt: string
  ): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        content: data.choices[0].message.content,
        tokens: data.usage.total_tokens,
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
    }
  }
}
```

### 3.2 记忆引擎

创建 `src/utils/memoryEngine.ts`:

```typescript
interface GameEvent {
  timestamp: number
  type: 'action' | 'combat' | 'npc_interaction' | 'decision' | 'discovery'
  description: string
  impact: string
}

interface CharacterMemory {
  attributes: Record<string, any>
  inventory: string[]
  relationships: Record<string, string>
}

interface SessionMemory {
  sessionId: string
  characterMemory: CharacterMemory
  events: GameEvent[]
  keyDecisions: any[]
  npcs: Record<string, any>
}

export class MemoryEngine {
  private memory: SessionMemory

  constructor(sessionId: string) {
    this.memory = {
      sessionId,
      characterMemory: {
        attributes: {},
        inventory: [],
        relationships: {},
      },
      events: [],
      keyDecisions: [],
      npcs: {},
    }
  }

  recordEvent(event: GameEvent) {
    this.memory.events.push(event)
  }

  recordNPC(id: string, details: any) {
    this.memory.npcs[id] = details
  }

  generateContext(): string {
    // 生成简化上下文用于 AI 调用
    const recentEvents = this.memory.events.slice(-5)
    return `
【角色属性】
${JSON.stringify(this.memory.characterMemory.attributes, null, 2)}

【最近事件】
${recentEvents.map(e => `- [${e.type}] ${e.description}`).join('\n')}

【已知 NPC】
${Object.entries(this.memory.npcs).map(([id, npc]) => `- ${npc.name}: ${npc.description}`).join('\n')}
    `
  }

  getFullHistory(): GameEvent[] {
    return this.memory.events
  }
}
```

### 3.3 Pinia 状态管理

创建 `src/stores/gameStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AIService } from '@/utils/aiService'
import { MemoryEngine } from '@/utils/memoryEngine'

export const useGameStore = defineStore('game', () => {
  const apiKey = ref<string>('')
  const isGameRunning = ref(false)
  const currentSession = ref<string>('')
  const messages = ref<Array<{ role: string; content: string }>>([])
  
  let aiService: AIService | null = null
  let memoryEngine: MemoryEngine | null = null

  const setApiKey = (key: string) => {
    apiKey.value = key
    aiService = new AIService(key)
  }

  const startGame = (sessionId: string) => {
    currentSession.value = sessionId
    memoryEngine = new MemoryEngine(sessionId)
    isGameRunning.value = true
    messages.value = []
  }

  const sendMessage = async (content: string, systemPrompt: string) => {
    if (!aiService || !memoryEngine) return

    // 添加玩家消息
    messages.value.push({ role: 'user', content })

    // 调用 AI
    const response = await aiService.callDM(
      messages.value as any,
      systemPrompt
    )

    // 记录 AI 回应
    messages.value.push({ role: 'assistant', content: response.content })

    // 记录到记忆库
    memoryEngine.recordEvent({
      timestamp: Date.now(),
      type: 'action',
      description: content,
      impact: response.content,
    })

    return response.content
  }

  return {
    apiKey,
    isGameRunning,
    currentSession,
    messages,
    setApiKey,
    startGame,
    sendMessage,
  }
})
```

---

## 四、UI 组件实现

### 4.1 游戏界面组件

创建 `src/components/GameBoard.vue`:

```vue
<template>
  <div class="game-board">
    <div class="game-container">
      <div class="chat-section">
        <div class="messages">
          <div v-for="(msg, idx) in messages" :key="idx" class="message" :class="msg.role">
            <div class="role-label">{{ msg.role === 'user' ? 'You' : 'DM' }}</div>
            <div class="content">{{ msg.content }}</div>
          </div>
        </div>
      </div>

      <div class="character-section">
        <h3>角色卡</h3>
        <div class="character-info">
          <textarea v-model="characterMarkdown" placeholder="角色信息（Markdown）"></textarea>
        </div>
      </div>

      <div class="input-section">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="输入你的行动..."
          type="text"
        />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const userInput = ref('')
const characterMarkdown = ref('# 我的角色\n\n## 属性\n- 力量: 10\n')
const messages = ref(gameStore.messages)

const sendMessage = async () => {
  if (!userInput.value) return

  const input = userInput.value
  userInput.value = ''

  const response = await gameStore.sendMessage(
    input,
    `你是一个经验丰富的TRPG游戏主持人。为玩家创造沉浸式体验。`
  )
}

onMounted(() => {
  // 初始化消息监听
  messages.value = gameStore.messages
})
</script>

<style scoped>
.game-board {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  height: 100vh;
}

.chat-section {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  background: #3d3d3d;
}

.message.user {
  background: #4a6fa5;
  margin-left: 2rem;
}

.message.assistant {
  background: #555;
}

.role-label {
  font-weight: bold;
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.character-section {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.character-info textarea {
  flex: 1;
  background: #3d3d3d;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.5rem;
  font-family: monospace;
  resize: none;
}

.input-section {
  display: flex;
  gap: 1rem;
}

.input-section input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #3d3d3d;
  color: white;
}

.input-section button {
  padding: 0.5rem 1rem;
  background: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 4.2 首页组件

创建 `src/views/Home.vue`:

```vue
<template>
  <div class="home">
    <h2>欢迎来到 TRPG AI IDE</h2>
    <div v-if="!gameStore.apiKey" class="setup">
      <h3>初始设置</h3>
      <div class="form-group">
        <label>OpenAI API Key:</label>
        <input v-model="tempApiKey" type="password" />
        <button @click="setupApiKey">保存 API Key</button>
      </div>
    </div>
    <div v-else class="ready">
      <p>✓ API 已配置</p>
      <router-link to="/game" class="btn">开始游戏</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const tempApiKey = ref('')

const setupApiKey = () => {
  gameStore.setApiKey(tempApiKey.value)
  tempApiKey.value = ''
}
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #4a6fa5;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
}
</style>
```

### 4.3 路由设置

创建 `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/game', component: () => import('@/components/GameBoard.vue') },
  { path: '/memories', component: () => import('@/views/Memories.vue') },
  { path: '/resources', component: () => import('@/views/Resources.vue') },
  { path: '/settings', component: () => import('@/views/Settings.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
```

---

## 五、构建和部署

### 5.1 GitHub Pages 部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 5.2 构建脚本

在 `package.json` 中添加:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 六、本地开发启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 七、测试清单

- [ ] API Key 设置和验证
- [ ] 消息发送和接收
- [ ] 角色卡编辑和保存
- [ ] 会话持久化（IndexedDB）
- [ ] 记忆库查询
- [ ] 骰子掷骰（如果集成）
- [ ] 响应式设计

---

## 八、下一步

1. **添加更多组件**: 记忆库视图、资源中心、设置页面
2. **记忆库优化**: 搜索、过滤、分析
3. **资源集成**: BCDice API、5e 数据
4. **UI 完善**: 主题、布局优化
5. **多人游戏支持**: WebSocket、实时同步

---

**完成日期**: 预计 1-2 周完成 Phase 1 MVP

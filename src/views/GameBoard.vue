<template>
  <div class="game-board">
    <div class="game-container">
      <!-- 侧边栏：阶段与操作 -->
      <aside class="sidebar">
        <div class="phase-card">
          <h3>阶段</h3>
          <p class="phase-text">当前：{{ gameStore.isOuter ? '游戏外层' : '游戏内层' }}</p>
          <div class="phase-actions">
            <button
              v-if="gameStore.isOuter"
              @click="handleEnterInner"
              :disabled="!gameStore.hasApiKey || gameStore.isSetupLoading"
              class="btn-primary"
            >
              进入游戏内层
            </button>
            <button
              v-else
              @click="handleExitToOuter"
              class="btn-secondary"
            >
              返回外层
            </button>
          </div>
          <p v-if="!gameStore.hasApiKey" class="phase-warning">
            ⚠️ 请先在主页设置 API Key
          </p>
        </div>

        <div v-if="gameStore.isInner" class="character-card">
          <h3>角色信息</h3>
          <div class="character-info">
            <p><strong>{{ gameStore.userDisplayName }}</strong></p>
            <p>职业: {{ gameStore.setupState.userCharacter.class || '未填写' }}</p>
          </div>
        </div>

        <div v-if="gameStore.isInner" class="game-actions">
          <button @click="handleNewGame" :disabled="!gameStore.canChat" class="btn-primary">
            开始新游戏
          </button>
          <button @click="handleClear" class="btn-secondary">
            清空历史
          </button>
        </div>
      </aside>

      <!-- 主区域 -->
      <main class="chat-area">
        <!-- 外层：设置向导 -->
        <div v-if="gameStore.isOuter" class="setup-container">
          <section class="setup-panel">
            <h2>游戏外层设置</h2>

            <div class="form-grid">
              <div class="form-item">
                <label>规则系统</label>
                <input
                  v-model="gameStore.setupState.ruleSystem"
                  placeholder="例如：D&D 5e / COC / 自定义"
                />
              </div>

              <div class="form-item">
                <label>用户身份</label>
                <select v-model="gameStore.setupState.userRole">
                  <option value="PL">玩家（PL）</option>
                  <option value="DM">DM（主持人）</option>
                </select>
              </div>

              <div class="form-item">
                <label>模组 / 世界</label>
                <input
                  v-model="gameStore.setupState.moduleWorld"
                  placeholder="例如：幽暗森林 / 城市冒险"
                />
              </div>

              <div class="form-item">
                <label>AI 风格</label>
                <select v-model="gameStore.setupState.aiStyle">
                  <option value="">未选择</option>
                  <option value="严肃">严肃</option>
                  <option value="幽默">幽默</option>
                  <option value="沙盒">沙盒</option>
                  <option value="战术">战术</option>
                  <option value="新手友好">新手友好</option>
                </select>
              </div>

              <div class="form-item full">
                <label>资源内容</label>
                <textarea
                  v-model="gameStore.setupState.resources"
                  placeholder="例如：使用 5e SRD / 本地规则补丁"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-item full">
                <label>世界设定 / 队友设定</label>
                <textarea
                  v-model="gameStore.setupState.worldNotes"
                  placeholder="补充世界背景、队友关系等"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="divider"></div>

            <h3>你的角色（PC）</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>名字</label>
                <input v-model="gameStore.setupState.userCharacter.name" placeholder="角色名" />
              </div>
              <div class="form-item">
                <label>称号</label>
                <input v-model="gameStore.setupState.userCharacter.title" placeholder="例如：银刃" />
              </div>
              <div class="form-item">
                <label>职业</label>
                <input v-model="gameStore.setupState.userCharacter.class" placeholder="例如：游侠" />
              </div>
              <div class="form-item full">
                <label>背景</label>
                <textarea
                  v-model="gameStore.setupState.userCharacter.background"
                  placeholder="简短背景描述"
                  rows="2"
                ></textarea>
              </div>
            </div>

            <button
              class="btn-secondary"
              @click="handleGenerateUserCharacter"
              :disabled="!gameStore.canSetupChat"
            >
              AI 引导生成角色
            </button>

            <div class="divider"></div>

            <h3>AI 队友（可选）</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>AI 队友数量 (0-3)</label>
                <input
                  v-model.number="aiPlayerCount"
                  type="number"
                  min="0"
                  max="3"
                  @change="handleAiPlayerCountChange"
                />
              </div>
              <div class="form-item">
                <label>快速生成</label>
                <button
                  class="btn-secondary"
                  @click="handleGenerateAiPlayers"
                  :disabled="!gameStore.canSetupChat || aiPlayerCount === 0"
                >
                  AI 生成队友
                </button>
              </div>
            </div>

            <div v-if="gameStore.setupState.aiPlayers.length" class="ai-players">
              <div
                v-for="player in gameStore.setupState.aiPlayers"
                :key="player.id"
                class="ai-player-card"
              >
                <h4>{{ player.name || 'AI 队友' }}</h4>
                <div class="form-grid">
                  <div class="form-item">
                    <label>名字</label>
                    <input v-model="player.name" placeholder="AI 角色名" />
                  </div>
                  <div class="form-item">
                    <label>称号</label>
                    <input v-model="player.title" placeholder="称号" />
                  </div>
                  <div class="form-item">
                    <label>定位</label>
                    <input v-model="player.role" placeholder="例如：法师/坦克" />
                  </div>
                  <div class="form-item full">
                    <label>背景</label>
                    <textarea v-model="player.background" rows="2"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="guide-panel">
            <div class="guide-header">
              <h2>外层引导对话</h2>
              <button
                class="btn-secondary"
                @click="handleGuideReset"
              >
                清空引导
              </button>
            </div>

            <div class="messages-container" ref="setupMessagesContainer">
              <div
                v-for="(msg, index) in gameStore.setupMessages"
                :key="index"
                :class="['message', `message-${msg.role}`]"
              >
                <div class="message-header">
                  <span class="message-role">{{ msg.senderName || getRoleName(msg.role) }}</span>
                  <span v-if="msg.timestamp" class="message-time">
                    {{ formatTime(msg.timestamp) }}
                  </span>
                </div>
                <div class="message-content">{{ msg.content }}</div>
              </div>

              <div v-if="gameStore.isSetupLoading" class="message message-assistant">
                <div class="message-header">
                  <span class="message-role">引导者</span>
                </div>
                <div class="message-content loading">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            </div>

            <div class="input-area">
              <textarea
                v-model="setupInput"
                @keydown.enter.exact.prevent="handleSetupSend"
                placeholder="向引导者提问或描述设定..."
                :disabled="!gameStore.canSetupChat || gameStore.isSetupLoading"
                rows="3"
              ></textarea>
              <button
                @click="handleSetupSend"
                :disabled="!gameStore.canSetupChat || gameStore.isSetupLoading || !setupInput.trim()"
                class="btn-send"
              >
                发送
              </button>
            </div>
          </section>
        </div>

        <!-- 内层：游戏对话 -->
        <div v-else class="inner-container">
          <div class="messages-container" ref="messagesContainer">
            <div
              v-for="(msg, index) in gameStore.messages"
              :key="index"
              :class="['message', `message-${msg.role}`]"
            >
              <div class="message-header">
                <span class="message-role">{{ msg.senderName || getRoleName(msg.role) }}</span>
                <span v-if="msg.timestamp" class="message-time">
                  {{ formatTime(msg.timestamp) }}
                </span>
              </div>
              <div class="message-content">{{ msg.content }}</div>
            </div>

            <div v-if="gameStore.isLoading" class="message message-assistant">
              <div class="message-header">
                <span class="message-role">DM</span>
              </div>
              <div class="message-content loading">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>

          <div class="input-area">
            <textarea
              v-model="userInput"
              @keydown.enter.exact.prevent="handleSend"
              placeholder="输入你的行动或对话... (Enter 发送, Shift+Enter 换行)"
              :disabled="!gameStore.canChat || gameStore.isLoading"
              rows="3"
            ></textarea>
            <button
              @click="handleSend"
              :disabled="!gameStore.canChat || gameStore.isLoading || !userInput.trim()"
              class="btn-send"
            >
              发送
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const userInput = ref('')
const setupInput = ref('')
const aiPlayerCount = ref(gameStore.setupState.aiPlayerCount)

const messagesContainer = ref<HTMLElement | null>(null)
const setupMessagesContainer = ref<HTMLElement | null>(null)

// 内层发送消息
const handleSend = async () => {
  if (!userInput.value.trim() || !gameStore.canChat) return

  const input = userInput.value
  userInput.value = ''

  try {
    await gameStore.sendMessage(input)
    await scrollToBottom(messagesContainer)
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 外层发送消息
const handleSetupSend = async () => {
  if (!setupInput.value.trim() || !gameStore.canSetupChat) return

  const input = setupInput.value
  setupInput.value = ''

  try {
    await gameStore.sendSetupMessage(input)
    await scrollToBottom(setupMessagesContainer)
  } catch (error) {
    console.error('发送引导消息失败:', error)
  }
}

// 进入内层
const handleEnterInner = async () => {
  await gameStore.enterInnerGame()
  await scrollToBottom(messagesContainer)
}

// 返回外层
const handleExitToOuter = () => {
  gameStore.exitToOuter()
}

// 清空历史
const handleClear = () => {
  if (confirm('确定要清空所有消息吗？')) {
    gameStore.clearAll()
  }
}

// 开始新游戏
const handleNewGame = () => {
  if (confirm('确定要开始新游戏吗？当前进度将被清空。')) {
    gameStore.startNewGame()
    scrollToBottom(messagesContainer)
  }
}

// 引导清空
const handleGuideReset = () => {
  gameStore.clearSetupMessages()
}

// 生成用户角色
const handleGenerateUserCharacter = async () => {
  try {
    await gameStore.generateUserCharacter()
  } catch (error) {
    console.error('生成角色失败:', error)
  }
}

// 生成 AI 队友
const handleGenerateAiPlayers = async () => {
  try {
    await gameStore.generateAiPlayers()
  } catch (error) {
    console.error('生成 AI 队友失败:', error)
  }
}

// AI 队友数量变化
const handleAiPlayerCountChange = () => {
  gameStore.updateAiPlayerCount(aiPlayerCount.value)
}

// 滚动到底部
const scrollToBottom = async (containerRef: { value: HTMLElement | null }) => {
  await nextTick()
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }
}

// 获取角色名称
const getRoleName = (role: string): string => {
  const names: Record<string, string> = {
    user: '玩家',
    assistant: 'DM',
    system: '系统',
  }
  return names[role] || role
}

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

watch(
  () => gameStore.setupState.aiPlayerCount,
  (count) => {
    aiPlayerCount.value = count
  }
)

onMounted(() => {
  scrollToBottom(messagesContainer)
  scrollToBottom(setupMessagesContainer)
})
</script>

<style scoped>
.game-board {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.game-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  height: calc(100vh - 40px);
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.phase-card,
.character-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.phase-card h3,
.character-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

.phase-text {
  margin: 0 0 10px 0;
  color: #555;
}

.phase-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phase-warning {
  margin-top: 10px;
  font-size: 0.9em;
  color: #856404;
  background: #fff3cd;
  padding: 8px 10px;
  border-radius: 6px;
}

.character-info p {
  margin: 8px 0;
  color: #555;
}

.game-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 主区域 */
.chat-area {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.setup-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.setup-panel,
.guide-panel {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: auto;
  min-height: 0;
}

.guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item.full {
  grid-column: span 2;
}

label {
  font-weight: 600;
  color: #2c3e50;
}

input,
select,
textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin: 8px 0;
}

.ai-players {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-player-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 14px;
}

.ai-player-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.inner-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fff;
}

/* 消息样式 */
.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-user {
  align-self: flex-end;
  background: #42b983;
  color: white;
}

.message-assistant {
  align-self: flex-start;
  background: #e8f4fd;
  color: #2c3e50;
  border-left: 3px solid #3498db;
}

.message-system {
  align-self: center;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
  text-align: center;
  max-width: 70%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.85em;
  opacity: 0.8;
}

.message-role {
  font-weight: bold;
}

.message-time {
  font-size: 0.9em;
}

.message-content {
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 加载动画 */
.loading {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3498db;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 输入区域 */
.input-area {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  align-items: flex-end;
  background: #fff;
}

.input-area textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  transition: border-color 0.3s;
}

.input-area textarea:focus {
  outline: none;
  border-color: #42b983;
}

.input-area textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

/* 按钮样式 */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #369970;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

.btn-secondary {
  background: #e0e0e0;
  color: #666;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn-send {
  background: #2c3e50;
  color: white;
  height: 48px;
}

.btn-send:hover:not(:disabled) {
  background: #1a252f;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .setup-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    width: 100%;
  }
}
</style>

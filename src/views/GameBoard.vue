<template>
  <div class="game-board">
    <div class="game-container">
      <!-- 侧边栏：角色信息 -->
      <aside class="sidebar">
        <div class="character-card">
          <h3>角色信息</h3>
          <div v-if="gameStore.characterCard" class="character-info">
            <p><strong>{{ gameStore.characterCard.name }}</strong></p>
            <p>职业: {{ gameStore.characterCard.class }}</p>
            <p>等级: {{ gameStore.characterCard.level }}</p>
            <p>HP: {{ gameStore.characterCard.hp }}/{{ gameStore.characterCard.maxHp }}</p>
          </div>
          <div v-else class="no-character">
            <p>暂无角色</p>
          </div>
        </div>
        
        <div class="game-actions">
          <button @click="handleNewGame" :disabled="!gameStore.canChat" class="btn-primary">
            开始新游戏
          </button>
          <button @click="handleClear" class="btn-secondary">
            清空历史
          </button>
        </div>
      </aside>

      <!-- 主区域：聊天界面 -->
      <main class="chat-area">
        <div class="messages-container" ref="messagesContainer">
          <div
            v-for="(msg, index) in gameStore.messages"
            :key="index"
            :class="['message', `message-${msg.role}`]"
          >
            <div class="message-header">
              <span class="message-role">{{ getRoleName(msg.role) }}</span>
              <span v-if="msg.timestamp" class="message-time">
                {{ formatTime(msg.timestamp) }}
              </span>
            </div>
            <div class="message-content">{{ msg.content }}</div>
          </div>

          <!-- 加载指示器 -->
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

        <!-- 输入区 -->
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

        <!-- 提示信息 -->
        <div v-if="!gameStore.hasApiKey" class="warning">
          ⚠️ 请先在主页设置 API Key
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const userInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// 发送消息
const handleSend = async () => {
  if (!userInput.value.trim() || !gameStore.canChat) return

  const input = userInput.value
  userInput.value = ''

  try {
    await gameStore.sendMessage(input)
    await scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 开始新游戏
const handleNewGame = () => {
  if (confirm('确定要开始新游戏吗？当前进度将被清空。')) {
    gameStore.startNewGame()
    scrollToBottom()
  }
}

// 清空历史
const handleClear = () => {
  if (confirm('确定要清空所有消息吗？')) {
    gameStore.clearAll()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
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

// 页面加载时滚动到底部
onMounted(() => {
  scrollToBottom()
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

.character-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.character-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

.character-info p {
  margin: 8px 0;
  color: #555;
}

.no-character {
  text-align: center;
  color: #999;
  padding: 20px 0;
}

.game-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 聊天区域 */
.chat-area {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  max-width: 60%;
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

/* 警告信息 */
.warning {
  padding: 12px 20px;
  background: #fff3cd;
  color: #856404;
  border-top: 1px solid #ffc107;
  text-align: center;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    width: 100%;
  }

  .chat-area {
    height: 60vh;
  }

  .message {
    max-width: 90%;
  }
}
</style>

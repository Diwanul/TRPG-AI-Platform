import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createAIService, type AIService, type ChatMessage } from '../services/aiService'
import type { GameMessage, CharacterCard } from '../types'

// 基础 DM Prompt
const DEFAULT_DM_PROMPT = `你是一位经验丰富的 TRPG 游戏主持人（DM）。你的职责是：

1. 创造生动、引人入胜的游戏场景
2. 根据玩家的行动描述结果
3. 保持故事的连贯性和趣味性
4. 适当地引入挑战和选择

规则：
- 用第二人称描述场景（"你看到..."）
- 每次回复不超过 200 字
- 在关键时刻给出明确的选择
- 保持友好和鼓励的语气

现在开始一场奇幻冒险吧！`

export const useGameStore = defineStore('game', () => {
  // 状态
  const apiKey = ref('')
  const messages = ref<GameMessage[]>([])
  const characterCard = ref<CharacterCard | null>(null)
  const isLoading = ref(false)
  const aiService = ref<AIService | null>(null)

  // 计算属性
  const hasApiKey = computed(() => apiKey.value.length > 0)
  const canChat = computed(() => hasApiKey.value && !isLoading.value)

  // 设置 API Key
  const setApiKey = (key: string) => {
    apiKey.value = key
    localStorage.setItem('apiKey', key)
    
    // 创建 AI 服务实例
    if (key) {
      aiService.value = createAIService(key)
    }
  }

  // 加载 API Key
  const loadApiKey = () => {
    const saved = localStorage.getItem('apiKey')
    if (saved) {
      setApiKey(saved)
    }
  }

  // 添加消息
  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    messages.value.push({
      role,
      content,
      timestamp: Date.now(),
    })
  }

  // 发送消息给 AI DM
  const sendMessage = async (userInput: string) => {
    if (!aiService.value) {
      throw new Error('AI 服务未初始化，请先设置 API Key')
    }

    if (!userInput.trim()) {
      return
    }

    // 添加用户消息
    addMessage('user', userInput)
    isLoading.value = true

    try {
      // 构建对话上下文
      const context: ChatMessage[] = messages.value.map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      // 获取 DM 回复
      const response = await aiService.value.getDMResponse(
        userInput,
        context.slice(-10), // 只保留最近 10 条消息作为上下文
        DEFAULT_DM_PROMPT
      )

      // 添加 AI 回复
      addMessage('assistant', response)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      addMessage('system', `错误: ${errorMessage}`)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 开始新游戏
  const startNewGame = () => {
    messages.value = []
    addMessage('assistant', '欢迎来到奇幻世界！你发现自己站在一座古老城镇的入口。远处传来钟声，街道上行人稀少。你想做什么？')
  }

  // 设置角色卡
  const setCharacterCard = (card: CharacterCard) => {
    characterCard.value = card
  }

  // 清空所有数据
  const clearAll = () => {
    messages.value = []
    characterCard.value = null
  }

  // 初始化
  loadApiKey()

  return {
    // 状态
    apiKey,
    messages,
    characterCard,
    isLoading,
    
    // 计算属性
    hasApiKey,
    canChat,
    
    // 方法
    setApiKey,
    addMessage,
    sendMessage,
    startNewGame,
    setCharacterCard,
    clearAll,
  }
})

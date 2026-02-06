import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createAIService, type AIService, type ChatMessage } from '../services/aiService'
import type {
  GameMessage,
  CharacterCard,
  SetupState,
  AIPlayer,
  UserCharacter,
} from '../types'

// 外层引导 Prompt
const SETUP_GUIDE_PROMPT = `你是一个 TRPG 游戏的开局引导者。
你的目标是帮助用户完成“游戏外层”的设置，包括：
- 规则系统
- 世界/模组
- AI 风格
- 资源内容
- 角色开卡（用户 PC 和 AI 队友）

规则：
- 用清晰的问题引导，不要一次问太多
- 当信息不完整时，优先询问缺失项
- 不要进入游戏内层剧情
- 语气友好，简明
`

// DM 基础 Prompt（会在进入内层时拼接外层设定）
const BASE_DM_PROMPT = `你是一位经验丰富的 TRPG 游戏主持人（DM）。
职责：
1. 创造生动、引人入胜的场景
2. 根据玩家行动描述结果
3. 保持故事连贯与趣味
4. 引入挑战与选择

规则：
- 用第二人称描述（"你看到..."）
- 每次回复不超过 200 字
- 关键时刻给出明确选择
- 语气友好、鼓励
`

// AI PL 基础 Prompt
const BASE_AI_PL_PROMPT = `你是一个 TRPG 玩家角色（PC）。
你需要：
- 扮演你的角色性格与立场
- 与 DM 和队友协作推进故事
- 行动要符合角色背景
- 不抢夺用户的主导权
`

const createDefaultUserCharacter = (): UserCharacter => ({
  name: '',
  title: '',
  class: '',
  background: '',
})

const createDefaultSetupState = (): SetupState => ({
  ruleSystem: '',
  userRole: 'PL',
  moduleWorld: '',
  aiStyle: '',
  resources: '',
  worldNotes: '',
  userCharacter: createDefaultUserCharacter(),
  aiPlayerCount: 0,
  aiPlayers: [],
})

const ensureAiPlayers = (players: AIPlayer[], count: number): AIPlayer[] => {
  const next = [...players]
  if (count < 0) return []

  while (next.length < count) {
    const index = next.length + 1
    next.push({
      id: `ai-${index}`,
      name: `AI队友${index}`,
      title: '',
      role: '',
      background: '',
    })
  }

  if (next.length > count) {
    next.splice(count)
  }

  return next
}

const parseJsonFromText = (text: string) => {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = codeBlockMatch ? codeBlockMatch[1] : text

  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start >= 0 && end >= 0 && end > start) {
    return JSON.parse(candidate.slice(start, end + 1))
  }

  throw new Error('AI 返回的内容不是有效 JSON，请重试或补充设定。')
}

export const useGameStore = defineStore('game', () => {
  // 基础状态
  const apiKey = ref('')
  const messages = ref<GameMessage[]>([])
  const setupMessages = ref<GameMessage[]>([])
  const characterCard = ref<CharacterCard | null>(null)
  const isLoading = ref(false)
  const isSetupLoading = ref(false)
  const aiService = ref<AIService | null>(null)

  // 外层/内层
  const phase = ref<'outer' | 'inner'>('outer')
  const setupState = ref<SetupState>(createDefaultSetupState())

  // 运行时 Prompt
  const dmSystemPrompt = ref('')
  const aiPlayerPrompts = ref<Record<string, string>>({})

  // 计算属性
  const hasApiKey = computed(() => apiKey.value.length > 0)
  const canChat = computed(() => hasApiKey.value && !isLoading.value)
  const canSetupChat = computed(() => hasApiKey.value && !isSetupLoading.value)
  const isOuter = computed(() => phase.value === 'outer')
  const isInner = computed(() => phase.value === 'inner')

  const userDisplayName = computed(() => {
    const { name, title } = setupState.value.userCharacter
    if (name && title) return `${name}·${title}`
    if (name) return name
    if (title) return title
    return '玩家'
  })

  // 设置 API Key
  const setApiKey = (key: string) => {
    apiKey.value = key
    localStorage.setItem('apiKey', key)

    if (key) {
      const isOpenRouter = key.startsWith('sk-or-')
      const referer = typeof window !== 'undefined' ? window.location.origin : ''
      const title = 'TRPG AI Platform'

      aiService.value = createAIService({
        apiKey: key,
        baseURL: isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined,
        model: isOpenRouter ? 'tngtech/deepseek-r1t2-chimera:free' : undefined,
        headers: isOpenRouter
          ? {
              'HTTP-Referer': referer,
              'X-Title': title,
            }
          : undefined,
      })
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
  const addMessage = (
    role: 'user' | 'assistant' | 'system',
    content: string,
    senderName?: string
  ) => {
    messages.value.push({
      role,
      content,
      senderName,
      timestamp: Date.now(),
    })
  }

  // 添加外层引导消息
  const addSetupMessage = (
    role: 'user' | 'assistant' | 'system',
    content: string,
    senderName?: string
  ) => {
    setupMessages.value.push({
      role,
      content,
      senderName,
      timestamp: Date.now(),
    })
  }

  const clearSetupMessages = () => {
    setupMessages.value = []
  }

  const buildSetupSummary = () => {
    const setup = setupState.value
    const aiPlayers = setup.aiPlayers
      .map((p, i) => `${i + 1}. ${p.name || '未命名'} ${p.title || ''} ${p.role || ''}`.trim())
      .join('\n')

    return [
      `规则系统: ${setup.ruleSystem || '未填写'}`,
      `用户身份: ${setup.userRole}`,
      `模组/世界: ${setup.moduleWorld || '未填写'}`,
      `AI 风格: ${setup.aiStyle || '未填写'}`,
      `资源内容: ${setup.resources || '未填写'}`,
      `世界设定: ${setup.worldNotes || '未填写'}`,
      `用户角色: ${setup.userCharacter.name || '未命名'} ${setup.userCharacter.title || ''} ${setup.userCharacter.class || ''}`.trim(),
      `AI 队友数量: ${setup.aiPlayerCount}`,
      aiPlayers ? `AI 队友列表:\n${aiPlayers}` : 'AI 队友列表: 无',
    ].join('\n')
  }

  const buildDmPrompt = () => {
    const setup = setupState.value
    const aiPlayers = setup.aiPlayers
      .map(p => `${p.name}${p.title ? `·${p.title}` : ''} - ${p.role || '队友'}`)
      .join('，')

    return [
      BASE_DM_PROMPT,
      `规则系统: ${setup.ruleSystem || '自由叙事'}`,
      `世界/模组: ${setup.moduleWorld || '自定义世界'}`,
      `AI 风格: ${setup.aiStyle || '平衡'}`,
      `资源内容: ${setup.resources || '无'}`,
      `世界设定: ${setup.worldNotes || '无'}`,
      `玩家角色: ${setup.userCharacter.name || '玩家'}${setup.userCharacter.title ? `·${setup.userCharacter.title}` : ''}`,
      `AI 队友: ${aiPlayers || '无'}`,
      `用户身份: ${setup.userRole}`,
    ].join('\n')
  }

  const buildAiPlayerPrompt = (player: AIPlayer) => {
    const setup = setupState.value
    return [
      BASE_AI_PL_PROMPT,
      `规则系统: ${setup.ruleSystem || '自由叙事'}`,
      `世界/模组: ${setup.moduleWorld || '自定义世界'}`,
      `AI 风格: ${setup.aiStyle || '平衡'}`,
      `你的角色: ${player.name}${player.title ? `·${player.title}` : ''}`,
      `角色定位: ${player.role || '队友'}`,
      `背景故事: ${player.background || '无'}`,
      `玩家角色: ${setup.userCharacter.name || '玩家'}`,
    ].join('\n')
  }

  // 外层引导消息
  const sendSetupMessage = async (userInput: string) => {
    if (!aiService.value) {
      throw new Error('AI 服务未初始化，请先设置 API Key')
    }

    if (!userInput.trim()) {
      return
    }

    addSetupMessage('user', userInput, '你')
    isSetupLoading.value = true

    try {
      const context: ChatMessage[] = setupMessages.value.map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      const systemPrompt = `${SETUP_GUIDE_PROMPT}\n\n当前已填写信息:\n${buildSetupSummary()}`

      const response = await aiService.value.getDMResponse(
        userInput,
        context.slice(-10),
        systemPrompt
      )

      addSetupMessage('assistant', response, '引导者')
    } finally {
      isSetupLoading.value = false
    }
  }

  // 生成用户角色
  const generateUserCharacter = async () => {
    if (!aiService.value) {
      throw new Error('AI 服务未初始化，请先设置 API Key')
    }

    isSetupLoading.value = true

    try {
      const prompt = `请基于以下世界设定，生成一个适合玩家的角色卡(JSON)：\n${buildSetupSummary()}\n\n要求：\n- 只返回 JSON，不要输出任何解释或文本\n- 字段为 name, title, class, background\n- 示例：{"name":"","title":"","class":"","background":""}`

      const response = await aiService.value.getDMResponse(
        prompt,
        [],
        SETUP_GUIDE_PROMPT
      )

      const data = parseJsonFromText(response)
      setupState.value.userCharacter = {
        name: data.name || '',
        title: data.title || '',
        class: data.class || '',
        background: data.background || '',
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '角色生成失败'
      addSetupMessage('system', message, '系统')
      throw error
    } finally {
      isSetupLoading.value = false
    }
  }

  // 生成 AI 队友
  const generateAiPlayers = async () => {
    if (!aiService.value) {
      throw new Error('AI 服务未初始化，请先设置 API Key')
    }

    const count = setupState.value.aiPlayerCount
    if (count <= 0) return

    isSetupLoading.value = true

    try {
      const prompt = `请基于以下设定生成 ${count} 名 AI 队友(JSON)：\n${buildSetupSummary()}\n\n要求：\n- 只返回 JSON，不要输出任何解释或文本\n- JSON 格式：{ "players": [ { "name": "", "title": "", "role": "", "background": "" } ] }`

      const response = await aiService.value.getDMResponse(
        prompt,
        [],
        SETUP_GUIDE_PROMPT
      )

      const data = parseJsonFromText(response)
      const players = Array.isArray(data.players) ? data.players : []

      setupState.value.aiPlayers = ensureAiPlayers(
        players.map((p: any, idx: number) => ({
          id: `ai-${idx + 1}`,
          name: p.name || `AI队友${idx + 1}`,
          title: p.title || '',
          role: p.role || '',
          background: p.background || '',
        })),
        count
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI 队友生成失败'
      addSetupMessage('system', message, '系统')
      throw error
    } finally {
      isSetupLoading.value = false
    }
  }

  const updateAiPlayerCount = (count: number) => {
    const safeCount = Math.max(0, Math.min(3, Math.floor(count)))
    setupState.value.aiPlayerCount = safeCount
    setupState.value.aiPlayers = ensureAiPlayers(setupState.value.aiPlayers, safeCount)
  }

  // 进入内层
  const enterInnerGame = async () => {
    dmSystemPrompt.value = buildDmPrompt()
    aiPlayerPrompts.value = setupState.value.aiPlayers.reduce((acc, p) => {
      acc[p.id] = buildAiPlayerPrompt(p)
      return acc
    }, {} as Record<string, string>)

    phase.value = 'inner'
    messages.value = []

    if (aiService.value) {
      isLoading.value = true
      try {
        const opening = await aiService.value.getDMResponse(
          '请作为 DM 给出本场游戏的开场白。',
          [],
          dmSystemPrompt.value
        )
        addMessage('assistant', opening, 'DM')
      } finally {
        isLoading.value = false
      }
    }
  }

  // 返回外层
  const exitToOuter = () => {
    phase.value = 'outer'
  }

  // 发送消息给 AI DM
  const sendMessage = async (userInput: string) => {
    if (!aiService.value) {
      throw new Error('AI 服务未初始化，请先设置 API Key')
    }

    if (!userInput.trim()) {
      return
    }

    addMessage('user', userInput, userDisplayName.value)
    isLoading.value = true

    try {
      const context: ChatMessage[] = messages.value.map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await aiService.value.getDMResponse(
        userInput,
        context.slice(-10),
        dmSystemPrompt.value || BASE_DM_PROMPT
      )

      addMessage('assistant', response, 'DM')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      addMessage('system', `错误: ${errorMessage}`, '系统')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 开始新游戏
  const startNewGame = async () => {
    messages.value = []
    if (!aiService.value) {
      addMessage('assistant', '欢迎来到奇幻世界！你想做什么？', 'DM')
      return
    }

    isLoading.value = true
    try {
      const opening = await aiService.value.getDMResponse(
        '请作为 DM 给出本场游戏的开场白。',
        [],
        dmSystemPrompt.value || BASE_DM_PROMPT
      )
      addMessage('assistant', opening, 'DM')
    } finally {
      isLoading.value = false
    }
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
    setupMessages,
    characterCard,
    isLoading,
    isSetupLoading,
    phase,
    setupState,

    // 计算属性
    hasApiKey,
    canChat,
    canSetupChat,
    isOuter,
    isInner,
    userDisplayName,

    // 方法
    setApiKey,
    addMessage,
    sendMessage,
    startNewGame,
    setCharacterCard,
    clearAll,
    sendSetupMessage,
    clearSetupMessages,
    generateUserCharacter,
    generateAiPlayers,
    updateAiPlayerCount,
    enterInnerGame,
    exitToOuter,
  }
})

// 游戏消息类型
export interface GameMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  senderName?: string
  timestamp?: number
}

// 角色卡类型
export interface CharacterCard {
  name: string
  class: string
  level: number
  hp: number
  maxHp: number
  stats: Record<string, number>
  background?: string
  equipment?: string[]
  [key: string]: any
}

// 用户角色（玩家 PC）
export interface UserCharacter {
  name: string
  title: string
  class: string
  background: string
}

// AI 玩家（AI PL）
export interface AIPlayer {
  id: string
  name: string
  title: string
  role: string
  background: string
}

// 游戏外层设置
export interface SetupState {
  ruleSystem: string
  userRole: 'PL' | 'DM'
  moduleWorld: string
  aiStyle: string
  resources: string
  worldNotes: string
  userCharacter: UserCharacter
  aiPlayerCount: number
  aiPlayers: AIPlayer[]
}

// 游戏状态类型
export interface GameState {
  currentScene: string
  messages: GameMessage[]
  characterCard: CharacterCard | null
  isLoading: boolean
}

// AI 配置类型
export interface AIConfig {
  apiKey: string
  model: string
  temperature: number
}

// 游戏事件类型（用于记忆系统）
export interface GameEvent {
  id: string
  timestamp: number
  type: 'action' | 'dialogue' | 'decision' | 'combat' | 'other'
  content: string
  context?: string
}

// 游戏消息类型
export interface GameMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
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
  [key: string]: any
}

// 游戏状态类型
export interface GameState {
  currentScene: string
  messages: GameMessage[]
  characterCard: CharacterCard | null
  isLoading: boolean
}

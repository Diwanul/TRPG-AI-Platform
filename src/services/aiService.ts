import axios, { type AxiosInstance } from 'axios'

/**
 * AI 服务配置
 */
interface AIConfig {
  apiKey: string
  model?: string
  baseURL?: string
}

/**
 * 消息格式
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * AI 响应
 */
export interface AIResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * AI 服务类 - 封装 OpenAI API 调用
 */
export class AIService {
  private client: AxiosInstance
  private model: string

  constructor(config: AIConfig) {
    this.model = config.model || 'gpt-3.5-turbo'
    
    // 创建 Axios 客户端，用于发送 HTTP 请求
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.openai.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      timeout: 60000, // 60 秒超时
    })
  }

  /**
   * 发送聊天请求到 OpenAI API
   * @param messages - 对话历史
   * @param temperature - 温度参数（0-2），越高越随机
   * @returns AI 的回复
   */
  async chat(
    messages: ChatMessage[],
    temperature: number = 0.7
  ): Promise<AIResponse> {
    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages,
        temperature,
        max_tokens: 2000, // 最大回复长度
      })

      const choice = response.data.choices[0]
      
      return {
        content: choice.message.content,
        usage: response.data.usage,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 处理 API 错误
        if (error.response) {
          const status = error.response.status
          const message = error.response.data?.error?.message || error.message

          if (status === 401) {
            throw new Error('API Key 无效，请检查设置')
          } else if (status === 429) {
            throw new Error('请求过于频繁，请稍后再试')
          } else if (status === 500) {
            throw new Error('OpenAI 服务器错误，请稍后再试')
          } else {
            throw new Error(`API 错误: ${message}`)
          }
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('请求超时，请检查网络连接')
        } else {
          throw new Error(`网络错误: ${error.message}`)
        }
      }
      
      throw error
    }
  }

  /**
   * 使用 DM Prompt 发起游戏对话
   * @param userInput - 玩家输入
   * @param gameContext - 游戏上下文（历史消息）
   * @param systemPrompt - DM 系统 Prompt
   * @returns DM 的回复
   */
  async getDMResponse(
    userInput: string,
    gameContext: ChatMessage[],
    systemPrompt: string
  ): Promise<string> {
    // 构建完整的消息列表
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...gameContext,
      { role: 'user', content: userInput },
    ]

    const response = await this.chat(messages)
    return response.content
  }

  /**
   * 更新 API Key
   */
  updateApiKey(apiKey: string): void {
    this.client.defaults.headers['Authorization'] = `Bearer ${apiKey}`
  }

  /**
   * 更新模型
   */
  updateModel(model: string): void {
    this.model = model
  }
}

/**
 * 创建 AI 服务实例
 */
export function createAIService(apiKey: string): AIService {
  return new AIService({ apiKey })
}

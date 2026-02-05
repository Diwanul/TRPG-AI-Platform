import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const apiKey = ref('')
  const messages = ref<Array<{ role: string; content: string }>>([])
  const characterCard = ref<any>(null)

  const setApiKey = (key: string) => {
    apiKey.value = key
    localStorage.setItem('apiKey', key)
  }

  const loadApiKey = () => {
    const saved = localStorage.getItem('apiKey')
    if (saved) {
      apiKey.value = saved
    }
  }

  const addMessage = (role: string, content: string) => {
    messages.value.push({ role, content })
  }

  const setCharacterCard = (card: any) => {
    characterCard.value = card
  }

  // 初始化时加载保存的 API Key
  loadApiKey()

  return {
    apiKey,
    messages,
    characterCard,
    setApiKey,
    addMessage,
    setCharacterCard,
  }
})

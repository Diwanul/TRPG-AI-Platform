<template>
  <div class="home">
    <h1>欢迎来到 TRPG AI Platform</h1>
    <p>与 AI 一起讲故事的 IDE</p>
    <div class="setup-card">
      <h2>开始前的准备</h2>
      <div class="setup-item">
        <label>OpenAI API Key</label>
        <input
          v-model="apiKey"
          type="password"
          placeholder="输入你的 API Key"
        />
        <button @click="saveApiKey">保存</button>
      </div>
      <div v-if="apiKeySaved" class="success">✅ API Key 已保存</div>
      <router-link to="/game" class="start-button">开始游戏</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const apiKey = ref('')
const apiKeySaved = ref(false)
const gameStore = useGameStore()

const saveApiKey = () => {
  if (apiKey.value.trim()) {
    gameStore.setApiKey(apiKey.value)
    apiKeySaved.value = true
  }
}
</script>

<style scoped>
.home {
  padding: 60px 20px;
  text-align: center;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #2c3e50;
}

p {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 40px;
}

.setup-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.setup-item {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 10px;
}

button:hover {
  background: #369970;
}

.success {
  color: #42b983;
  font-weight: bold;
  margin: 20px 0;
}

.start-button {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 30px;
  background: #2c3e50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.start-button:hover {
  background: #1a252f;
}
</style>

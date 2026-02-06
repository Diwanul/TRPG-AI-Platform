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

    <div class="guide-card">
      <h2>如何获取 API Key（详细版）</h2>

      <div class="guide-section">
        <h3>OpenAI</h3>
        <ol>
          <li>打开官网并登录: https://platform.openai.com/</li>
          <li>进入 "API keys" 页面</li>
          <li>点击 "Create new secret key"</li>
          <li>复制生成的 Key（只显示一次）</li>
          <li>回到本页面，粘贴到上方输入框并保存</li>
        </ol>
        <p class="note">提示: Key 泄露会产生费用，请不要分享给别人。</p>
      </div>

      <div class="guide-section">
        <h3>Anthropic (Claude)</h3>
        <ol>
          <li>打开官网并登录: https://console.anthropic.com/</li>
          <li>进入 "API Keys" 页面</li>
          <li>点击 "Create Key"</li>
          <li>复制生成的 Key</li>
          <li>回到本页面，粘贴到上方输入框并保存</li>
        </ol>
        <p class="note">当前默认使用 OpenAI，如需 Claude 我可以帮你切换。</p>
      </div>

      <div class="guide-section">
        <h3>常见问题</h3>
        <ul>
          <li>API Key 会保存在你的浏览器本地，不会上传到服务器。</li>
          <li>如果显示 401/Invalid key，说明 Key 无效或输错。</li>
          <li>如果显示 429，说明请求太频繁或额度不足。</li>
        </ul>
      </div>
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

.guide-card {
  max-width: 700px;
  margin: 30px auto 0;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  text-align: left;
}

.guide-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.guide-section {
  margin-top: 20px;
}

.guide-section h3 {
  margin-bottom: 8px;
  color: #34495e;
}

.guide-section ol,
.guide-section ul {
  padding-left: 18px;
  margin: 8px 0 0;
}

.note {
  margin-top: 8px;
  font-size: 0.9em;
  color: #666;
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

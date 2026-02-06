<template>
  <div id="app">
    <nav>
      <router-link to="/">主页</router-link>
      <router-link to="/game">游戏</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 15px;
}

nav a:hover {
  color: #42b983;
}

nav a.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 5px;
}
</style>

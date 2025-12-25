<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <el-aside width="200px" style="background-color: #2e3b4e;">
        <el-menu
          default-active="/clubs"
          class="el-menu-vertical-demo"
          background-color="#2e3b4e"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/clubs">
            <el-icon><Menu /></el-icon>
            <template #title>社团管理</template>
          </el-menu-item>
          <el-menu-item index="/activities">
            <el-icon><Calendar /></el-icon>
            <template #title>活动管理</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { Menu, Calendar } from '@element-plus/icons-vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
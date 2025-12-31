<template>
  <!-- 路由出口：所有路由组件都会渲染到这里 -->
  <router-view />
</template>

<script setup>
// 此处可添加全局逻辑，暂时留空即可（满足单文件组件要求）
</script>

<style>
/* 全局样式重置（可选，可根据需要修改） */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}
</style>
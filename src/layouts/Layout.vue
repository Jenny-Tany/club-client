<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside width="200px" style="background-color: #2e3b4e;">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#2e3b4e"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <!-- 社团管理 -->
        <el-sub-menu index="club">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>社团管理</span>
          </template>
          <el-menu-item index="/home/club/list">社团列表</el-menu-item>
          <el-menu-item index="/home/club/my">我的社团</el-menu-item>
          <el-menu-item index="/home/club/my/applications">我的申请</el-menu-item>
        </el-sub-menu>
        <!-- 活动管理 -->
        <el-sub-menu index="activity">
          <template #title>
            <el-icon><Calendar /></el-icon>
            <span>活动管理</span>
          </template>
          <el-menu-item index="/home/activity/list">活动列表</el-menu-item>
          <el-menu-item index="/home/activity/my-signups">我的报名</el-menu-item>
        </el-sub-menu>
        <!-- 个人信息 -->
        <el-menu-item index="/home/user/info">
          <el-icon><User /></el-icon>
          <template #title>个人信息</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>{{ userStore.userInfo.username || '用户' }}</span>
      </el-header>

      <!-- 内容区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { House, UserFilled, Calendar, User, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/pinia/userStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

// 退出登录
const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped>
.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
}

.el-aside {
  color: #333;
}
</style>
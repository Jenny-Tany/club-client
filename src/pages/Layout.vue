<!-- <template>
    <el-container style="height: 100vh;">
      <!-- 侧边栏 -->
      <el-aside width="200px" style="background-color: #2e3b4e;">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#2e3b4e"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleMenuSelect"
        >
          <el-menu-item index="1">
            <el-icon><House /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>个人中心</span>
            </template>
            <el-menu-item index="2-1">个人信息</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Collection /></el-icon>
              <span>社团管理</span>
            </template>
            <el-menu-item index="3-1">社团列表</el-menu-item>
            <el-menu-item index="3-2">我的社团</el-menu-item>
            <el-menu-item index="3-3">我的申请</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><Calendar /></el-icon>
              <span>活动管理</span>
            </template>
            <el-menu-item index="4-1">活动列表</el-menu-item>
            <el-menu-item index="4-2">我的报名</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="5" @click="handleLogout">
            <el-icon><Logout /></el-icon>
            <template #title>退出登录</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
  
      <el-container>
        <!-- 顶部导航 -->
        <el-header style="text-align: right; font-size: 12px">
          <div>
            <el-dropdown>
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item>修改密码</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>欢迎您，{{ userInfo?.username || '用户' }}</span>
          </div>
        </el-header>
  
        <!-- 主内容区域 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../stores/user'
  import { ElMessage } from 'element-plus'
  import {
    House,
    UserFilled,
    Collection,
    Calendar,
    Logout
  } from '@element-plus/icons-vue'
  
  const router = useRouter()
  const userStore = useUserStore()
  const userInfo = ref(userStore.userInfo)
  
  // 菜单选择事件
  const handleMenuSelect = (index) => {
    const routeMap = {
      '1': '/home/dashboard',
      '2-1': '/home/user-info',
      '3-1': '/home/club/list',
      '3-2': '/home/club/my-club',
      '3-3': '/home/club/my-apply',
      '4-1': '/home/activity/list',
      '4-2': '/home/activity/my-signup'
    }
    if (routeMap[index]) {
      router.push(routeMap[index])
    }
  }
  
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
  
  .el-menu-vertical-demo {
    height: 100vh;
    border-right: 0;
  }
  
  .el-main {
    background-color: #f5f7fa;
    padding: 16px;
  }
  </style> -->
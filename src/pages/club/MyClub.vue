<template>
  <div class="my-club-container">
    <el-card title="我的已加入社团" shadow="hover" class="club-card">
      <!-- 加载状态 -->
      <el-skeleton v-if="loading" :rows="6" animated></el-skeleton>

      <!-- 社团列表 -->
      <el-table 
        v-else 
        :data="myClubList" 
        border 
        style="width: 100%" 
        @row-click="goToClubDetail"
        v-loading="loading"
      >
        <el-table-column prop="id" label="社团ID" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="社团名称" min-width="150" align="center"></el-table-column>
        <el-table-column prop="description" label="社团简介" min-width="300" align="center"></el-table-column>
        <el-table-column prop="createUsername" label="社团负责人" width="120" align="center"></el-table-column>
        <el-table-column label="我的角色" width="120" align="center">
          <template #default="scope">
            <!-- 核心：对比当前用户用户名和社团创建人用户名 -->
            <el-tag 
              v-if="scope.row.createUsername === userStore.userInfo.username" 
              type="primary"
            >
              负责人
            </el-tag>
            <el-tag v-else type="success">普通成员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button type="text" @click="goToClubDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空数据提示 -->
      <el-empty 
        v-if="!loading && myClubList.length === 0" 
        description="暂无已加入的社团"
      ></el-empty>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
// 引入Pinia用户仓库（路径和你的实际文件一致）
import { useUserStore } from '@/pinia/userStore'
import { getMyClub } from '@/api/club'

// 初始化路由和Pinia
const router = useRouter()
const userStore = useUserStore() // 直接获取store实例，无需ref包裹

// 状态管理
const loading = ref(false)
const myClubList = ref([])

// 获取我的社团数据
const getMyClubData = async () => {
  // 前置校验：用户未登录/无用户信息时直接返回
  if (!userStore.token || !userStore.userInfo.username) {
    ElMessage.warning('请先登录并完善用户信息')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const res = await getMyClub()
    // 兼容后端不同返回格式：直接数组 / 分页格式(records) / 空值兜底
    myClubList.value = res.data?.records || res.data || []
    console.log('我的社团列表：', myClubList.value)
    console.log('当前用户信息：', userStore.userInfo) // 调试用，可删除
  } catch (error) {
    console.error('获取我的社团失败：', error)
    ElMessage.error('获取我的社团失败，请稍后重试')
    myClubList.value = []
  } finally {
    loading.value = false
  }
}

// 跳转到社团详情
const goToClubDetail = (row) => {
  if (!row.id) {
    ElMessage.warning('社团ID不存在，无法查看详情')
    return
  }
  router.push(`/home/club/detail/${row.id}`)
}

// 页面挂载时加载数据
onMounted(() => {
  // 确保用户已登录（路由守卫也会拦截，但双层校验更安全）
  if (userStore.token) {
    getMyClubData()
  } else {
    router.push('/login')
  }
})
</script>

<style scoped>
.my-club-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 120px);
}

.club-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  padding: 10px;
}

/* 骨架屏样式适配 */
.el-skeleton {
  padding: 10px;
  margin-bottom: 10px;
}
</style>
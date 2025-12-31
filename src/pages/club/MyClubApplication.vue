<template>
  <div class="my-club-application-container">
    <el-card title="我的社团申请记录" shadow="hover" class="application-card">
      <el-table :data="myApplicationList" border style="width: 100%">
        <el-table-column prop="id" label="申请ID" width="80" align="center"></el-table-column>
        <el-table-column prop="clubName" label="社团名称" min-width="150" align="center"></el-table-column>
        <el-table-column prop="reason" label="申请理由" min-width="300" align="center"></el-table-column>
        <!-- 核心：调用格式化函数处理申请时间 -->
        <el-table-column label="申请时间" width="180" align="center">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'pending'" type="warning">待审核</el-tag>
            <el-tag v-if="scope.row.status === 'approved'" type="success">已通过</el-tag>
            <el-tag v-if="scope.row.status === 'rejected'" type="danger">已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button type="text" @click="goToClubDetail(scope.row.clubId)">社团详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="myApplicationList.length === 0" description="暂无社团申请记录"></el-empty>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMyClubApplications } from '@/api/club'

const router = useRouter()
const myApplicationList = ref([])

// 新增：时间格式化函数（适配ISO格式时间）
const formatDateTime = (dateStr) => {
  // 空值兜底
  if (!dateStr) return '暂无时间'
  
  // 处理ISO时间（替换T为空格，裁剪秒数后多余的字符）
  const date = new Date(dateStr)
  // 兼容无效时间
  if (isNaN(date.getTime())) return '时间格式错误'

  // 格式化：YYYY-MM-DD HH:mm:ss（如需简化为HH:mm，去掉:ss即可）
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  // 最终格式：2025-12-30 21:42:02
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 获取我的申请记录
const getMyApplicationData = async () => {
  try {
    const res = await getMyClubApplications()
    // 兼容后端不同返回格式（直接数组/分页records）
    myApplicationList.value = res.data?.records || res.data || []
  } catch (error) {
    console.error('获取我的申请记录失败：', error)
    ElMessage.error('获取我的申请记录失败')
  }
}

// 跳转到社团详情
const goToClubDetail = (clubId) => {
  if (!clubId) {
    ElMessage.warning('社团ID不存在，无法查看详情')
    return
  }
  router.push(`/home/club/detail/${clubId}`)
}

onMounted(() => {
  getMyApplicationData()
})
</script>

<style scoped>
.my-club-application-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 120px);
}
.application-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}
</style>
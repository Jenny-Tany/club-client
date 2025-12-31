<template>
    <div class="my-club-application-container">
      <el-card title="我的社团申请记录" shadow="hover" class="application-card">
        <el-table :data="myApplicationList" border style="width: 100%">
          <el-table-column prop="id" label="申请ID" width="80" align="center"></el-table-column>
          <el-table-column prop="clubName" label="社团名称" min-width="150" align="center"></el-table-column>
          <el-table-column prop="reason" label="申请理由" min-width="300" align="center"></el-table-column>
          <el-table-column prop="applyTime" label="申请时间" width="180" align="center"></el-table-column>
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
  
  // 获取我的申请记录
  const getMyApplicationData = async () => {
    try {
      const res = await getMyClubApplications()
      myApplicationList.value = res.data // 按后端返回格式调整
    } catch (error) {
      console.error('获取我的申请记录失败：', error)
      ElMessage.error('获取我的申请记录失败')
    }
  }
  
  // 跳转到社团详情
  const goToClubDetail = (clubId) => {
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
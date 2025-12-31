<template>
    <div class="my-club-container">
      <el-card title="我的已加入社团" shadow="hover" class="club-card">
        <!-- 社团列表 -->
        <el-table :data="myClubList" border style="width: 100%" @row-click="goToClubDetail">
          <el-table-column prop="id" label="社团ID" width="80" align="center"></el-table-column>
          <el-table-column prop="name" label="社团名称" min-width="150" align="center"></el-table-column>
          <el-table-column prop="description" label="社团简介" min-width="300" align="center"></el-table-column>
          <el-table-column prop="leaderName" label="社团负责人" width="120" align="center"></el-table-column>
          <el-table-column prop="memberRole" label="我的角色" width="120" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.memberRole === 'leader'" type="primary">负责人</el-tag>
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
        <el-empty v-if="myClubList.length === 0" description="暂无已加入的社团"></el-empty>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { getMyClub } from '@/api/club'
  
  const router = useRouter()
  // 我的社团列表数据源
  const myClubList = ref([])
  
  // 获取我的社团数据
  const getMyClubData = async () => {
    try {
      const res = await getMyClub()
      // 接口返回数据赋值给数据源
      myClubList.value = res.data // 按后端返回格式调整，若有records则写 res.data.records
    } catch (error) {
      console.error('获取我的社团失败：', error)
      ElMessage.error('获取我的社团失败，请检查服务连接')
    }
  }
  
  // 跳转到社团详情
  const goToClubDetail = (row) => {
    router.push(`/home/club/detail/${row.id}`)
  }
  
  // 页面挂载时自动加载数据
  onMounted(() => {
    getMyClubData()
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
  }
  </style>
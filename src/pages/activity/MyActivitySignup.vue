<template>
    <div class="my-activity-signup-container">
      <el-card title="我的活动报名记录" shadow="hover" class="signup-card">
        <el-table :data="mySignupList" border style="width: 100%">
          <el-table-column prop="activityId" label="活动编号" width="120" align="center"></el-table-column>
          <!-- 报名ID：匹配后端id字段 -->
          <el-table-column prop="id" label="报名ID" width="80" align="center"></el-table-column>
          
          <!-- 活动名称：匹配后端activityTitle字段 -->
          <el-table-column 
            prop="activityTitle" 
            label="活动名称" 
            min-width="150" 
            align="center"
          ></el-table-column>
          
          <!-- 报名状态：匹配后端status字段（registered/checked_in） -->
           
          <el-table-column label="报名状态" width="120" align="center">
            <template #default="scope">
              <el-tag v-show="scope.row.status === 'registered'" type="primary">已报名</el-tag>
              <el-tag v-show="scope.row.status === 'checked_in'" type="success">已签到</el-tag>
              <el-tag v-show="!['registered', 'checked_in'].includes(scope.row.status)" type="danger">已取消</el-tag>
            </template>
          </el-table-column>
          
          <!-- 报名时间：匹配后端signupTime字段 -->
          <el-table-column 
            prop="signupTime" 
            label="报名时间" 
            width="200" 
            align="center"
          >
            <!-- 自定义模板格式化时间 -->
            <template #default="scope">
              {{ formatTime(scope.row.signupTime) }}
            </template>
          </el-table-column>
          
          <!-- 签到时间：匹配后端checkinTime字段（为空显示"-"） -->
          
          <!-- 操作列：活动详情+取消报名 -->
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-button
                type="text"
                @click="goToActivityDetail(scope.row.activityId)"
              >
                活动详情
              </el-button>
              <el-button
                v-if="scope.row.status === 'registered'"
                type="text"
                text-color="danger"
                @click="handleCancelSignup(scope.row.id)"
              >
                取消报名
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 空数据提示 -->
        <el-empty v-if="mySignupList.length === 0" description="暂无活动报名记录"></el-empty>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getMyActivitySignups, cancelActivitySignup } from '@/api/activity'
  
  const router = useRouter()
  const mySignupList = ref([])

  // 时间格式化函数
const formatTime = (timeStr) => {
  if (!timeStr) return '无报名时间' // 空值兜底
  // 替换 T 为空格，若需要去掉秒级精度可额外处理
  return timeStr.replace('T', ' ').split(':').slice(0,2).join(':') 
  // 进阶：只保留 年月日 时分 → timeStr.replace('T', ' ').split(':').slice(0,2).join(':')
}
  
  // 获取我的报名记录（适配后端返回结构）
  const getMySignupData = async () => {
    try {
      const res = await getMyActivitySignups()
      // 后端直接返回data数组，无需取records
      mySignupList.value = res.data 
    } catch (error) {
      console.error('获取我的报名记录失败：', error)
      ElMessage.error('获取我的报名记录失败')
    }
  }
  
  // 取消报名（传报名ID，匹配后端接口要求）
  const handleCancelSignup = async (signupId) => {
    try {
      await ElMessageBox.confirm(
        '确定要取消该活动报名吗？',
        '取消报名',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await cancelActivitySignup(signupId)
      ElMessage.success('取消报名成功')
      getMySignupData() // 刷新列表
    } catch (error) {
      if (error !== 'cancel') { // 排除点击取消按钮的情况
        console.error('取消报名失败：', error)
        ElMessage.error('取消报名失败')
      }
    }
  }
  
  // 跳转到活动详情（传活动ID）
  const goToActivityDetail = (activityId) => {
    router.push(`/home/activity/detail/${activityId}`)
  }
  
  // 页面挂载加载数据
  onMounted(() => {
    getMySignupData()
  })
  </script>
  
  <style scoped>
  .my-activity-signup-container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 120px);
  }
  .signup-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
  </style>
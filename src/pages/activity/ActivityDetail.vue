<template>
    <div class="activity-detail-container" v-loading="loading">
      <el-card v-if="activityDetail" class="activity-card">
        <div class="activity-header">
          <h2>{{ activityDetail.name }}</h2>
          <el-tag :type="getActivityStatusTagType(activityDetail.status)">
            {{ getActivityStatusText(activityDetail.status) }}
          </el-tag>
        </div>
  
        <div class="activity-info">
          <el-descriptions :column="2" border style="margin-top: 20px">
            <el-descriptions-item label="活动ID">{{ activityDetail.id }}</el-descriptions-item>
            <el-descriptions-item label="所属社团">{{ activityDetail.clubName || '无' }}</el-descriptions-item>
            <el-descriptions-item label="活动时间">
              {{ activityDetail.startTime }} - {{ activityDetail.endTime }}
            </el-descriptions-item>
            <el-descriptions-item label="活动地点">{{ activityDetail.location }}</el-descriptions-item>
            <el-descriptions-item label="活动容量" :span="2">
              {{ activityDetail.currentMembers }} / {{ activityDetail.maxMembers }} 人
            </el-descriptions-item>
            <el-descriptions-item label="活动简介" :span="2">
              <div style="white-space: pre-wrap; text-align: left">{{ activityDetail.description }}</div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
  
        <div class="activity-btn-group" style="margin-top: 30px; text-align: center">
          <el-button
            v-if="!hasSignup"
            type="primary"
            @click="handleSignup"
            :disabled="!canSignup"
          >
            报名参加
          </el-button>
          <el-button
            v-else
            type="danger"
            @click="handleCancelSignup"
            :disabled="!canCancel"
          >
            取消报名
          </el-button>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { getActivityDetail } from '@/api/activity'
  import { signupActivity, cancelActivitySignup } from '@/api/activity'
  
  const router = useRouter()
  const route = useRoute()
  const loading = ref(false)
  const activityId = ref(route.params.id)
  const activityDetail = ref(null)
  const hasSignup = ref(false) // 是否已报名
  const canSignup = ref(true) // 是否可报名
  const canCancel = ref(true) // 是否可取消报名
  
  // 获取活动状态标签类型
  const getActivityStatusTagType = (status) => {
    switch (status) {
      case 'ongoing':
        return 'success'
      case 'pending':
      case 'approved':
        return 'warning'
      case 'completed':
        return 'info'
      case 'cancelled':
      case 'rejected':
        return 'danger'
      default:
        return ''
    }
  }
  
  // 获取活动状态文本
  const getActivityStatusText = (status) => {
    const statusMap = {
      pending: '待审核',
      approved: '已审核',
      ongoing: '进行中',
      completed: '已完成',
      cancelled: '已取消',
      rejected: '已驳回'
    }
    return statusMap[status] || status
  }
  
  // 获取活动详情
  const getActivityDetailData = async () => {
    try {
      loading.value = true
      const res = await getActivityDetail(activityId.value)
      activityDetail.value = res.data
      // 模拟：实际项目中可从接口获取是否已报名
      hasSignup.value = res.data.hasSignup || false
      // 判断是否可报名/取消
      canSignup.value = ['pending', 'approved', 'ongoing'].includes(res.data.status) && !hasSignup.value
      canCancel.value = ['pending', 'approved', 'ongoing'].includes(res.data.status) && hasSignup.value
    } catch (error) {
      console.error('获取活动详情失败：', error)
    } finally {
      loading.value = false
    }
  }
  
  // 报名活动
  const handleSignup = async () => {
    try {
      await signupActivity(activityId.value)
      ElMessage.success('报名成功')
      hasSignup.value = true
      canSignup.value = false
      canCancel.value = true
      // 刷新活动详情
      getActivityDetailData()
    } catch (error) {
      console.error('报名失败：', error)
    }
  }
  
  // 取消报名
  const handleCancelSignup = async () => {
    try {
      await cancelActivitySignup(activityId.value)
      ElMessage.success('取消报名成功')
      hasSignup.value = false
      canSignup.value = true
      canCancel.value = false
      // 刷新活动详情
      getActivityDetailData()
    } catch (error) {
      console.error('取消报名失败：', error)
    }
  }
  
  // 返回活动列表
  const goBack = () => {
    router.push('/home/activity/list')
  }
  
  // 页面挂载时加载数据
  onMounted(() => {
    getActivityDetailData()
  })
  </script>
  
  <style scoped>
  .activity-detail-container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 120px);
  }
  
  .activity-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
  
  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 10px;
  }
  
  .activity-info {
    margin-top: 10px;
  }
  </style>
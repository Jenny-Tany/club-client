<template>
  <div class="activity-detail-container" v-loading="loading" element-loading-text="加载活动详情中...">
    <!-- 无数据兜底 -->
    <el-empty v-if="!loading && !activityDetail" description="暂无活动信息"></el-empty>
    
    <el-card v-else-if="activityDetail" class="activity-card">
      <!-- 活动标题+状态 -->
      <div class="activity-header">
        <h2 class="activity-title">{{ activityDetail.title || '未命名活动' }}</h2>
        <el-tag :type="getActivityStatusTagType(activityDetail.status)" size="large">
          {{ getActivityStatusText(activityDetail.status) }}
        </el-tag>
      </div>

      <!-- 活动核心信息 -->
      <div class="activity-info">
        <el-descriptions 
          :column="2" 
          border 
          size="medium"
          style="margin-top: 20px"
          :label-style="{ fontWeight: '600', color: '#333' }"
        >
          <!-- 基础信息 -->
          <el-descriptions-item label="活动ID">
            {{ activityDetail.id || '——' }}
          </el-descriptions-item>
          <el-descriptions-item label="所属社团">
            {{ activityDetail.clubName || activityDetail.club?.name || '无' }}
          </el-descriptions-item>
          
          <!-- 时间（格式化ISO时间） -->
          <el-descriptions-item label="活动时间">
            {{ formatTime(activityDetail.startTime) }} - {{ formatTime(activityDetail.endTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="报名截止时间">
            {{ formatTime(activityDetail.signupEndTime) || '无截止时间' }}
          </el-descriptions-item>
          
          <!-- 地点+发起人 -->
          <el-descriptions-item label="活动地点">
            {{ activityDetail.location || '未指定' }}
          </el-descriptions-item>
          <el-descriptions-item label="活动发起人">
            {{ activityDetail.createUsername || '未知' }}
          </el-descriptions-item>
          
          <!-- 参与人数 -->
          <el-descriptions-item label="活动容量" :span="2">
            <span :class="{ 'text-warning': activityDetail.currentMembers >= activityDetail.maxMembers }">
              {{ activityDetail.currentMembers || 0 }} / {{ activityDetail.maxMembers || '不限' }} 人
            </span>
            <el-tag size="small" type="warning" v-if="activityDetail.currentMembers >= activityDetail.maxMembers">
              已满员
            </el-tag>
          </el-descriptions-item>
          
          <!-- 活动简介（支持换行+空值兜底） -->
          <el-descriptions-item label="活动简介" :span="2">
            <div class="desc-content">
              {{ activityDetail.content || '暂无活动简介' }}
            </div>
          </el-descriptions-item>
          
          <!-- 扩展字段（根据后端返回补充） -->
          <el-descriptions-item label="活动类型" v-if="activityDetail.type" :span="2">
            {{ activityDetail.type }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">
            {{ formatTime(activityDetail.createTime) || '——' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 操作按钮组（优化禁用逻辑+提示） -->
      <div class="activity-btn-group">
        <!-- 报名按钮 -->
        <el-button
          v-if="!hasSignup"
          type="primary"
          size="large"
          @click="handleSignup"
          :disabled="!canSignup"
        >
          报名参加
          <!-- 优化提示：区分不同禁用原因 -->
          <el-tooltip v-if="!canSignup" :content="getSignupDisabledTip()" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-button>
        
        <!-- 取消报名按钮 -->
        <el-button
          v-else
          type="danger"
          size="large"
          @click="handleCancelSignup"
          :disabled="!canCancel"
          icon="el-icon-user-delete"
        >
          取消报名
          <el-tooltip v-if="!canCancel" content="仅已报名的待审核/已审核/进行中/已发布活动可取消" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-button>
        
        <!-- 返回按钮 -->
        <el-button
          size="large"
          @click="goBack"
        >
          返回列表
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getActivityDetail, signupActivity, cancelActivitySignup } from '@/api/activity'

const router = useRouter()
const route = useRoute()

// 状态管理
const loading = ref(false)
const activityId = ref(route.params.id)
const activityDetail = ref(null)
const hasSignup = ref(false) // 是否已报名

// 核心修复：添加 published 到可报名状态列表
const canSignup = computed(() => {
  if (!activityDetail.value) {
    console.log('canSignup：活动详情未加载')
    return false
  }
  
  const { 
    status, 
    currentMembers, 
    maxMembers, 
    signupEndTime 
  } = activityDetail.value

  // 1. 打印所有判断条件（方便调试）
  console.log('===== 报名条件校验 =====')
  console.log('活动状态：', status)
  console.log('是否已报名：', hasSignup.value)
  console.log('当前人数/最大人数：', currentMembers, '/', maxMembers)
  console.log('报名截止时间（原始）：', signupEndTime)
  
  // 2. 基础状态校验：新增 published（已发布）状态
  const isStatusValid = ['pending', 'approved', 'ongoing', 'published'].includes(status)
  console.log('状态是否有效：', isStatusValid)
  
  // 3. 未报名校验
  const isNotSignedUp = !hasSignup.value
  console.log('是否未报名：', isNotSignedUp)
  
  // 4. 人数校验：未报满（无最大人数则视为不限）
  const isNotFull = maxMembers ? currentMembers < maxMembers : true
  console.log('是否未报满：', isNotFull)
  
  // 5. 时间校验：时间戳对比（时区无关）
  let isBeforeDeadline = false
  if (signupEndTime) {
    try {
      const deadlineTime = new Date(signupEndTime).getTime() // 截止时间戳
      const nowTime = new Date().getTime() // 当前时间戳
      isBeforeDeadline = deadlineTime > nowTime
      
      // 打印时间戳对比结果
      console.log('截止时间戳：', deadlineTime)
      console.log('当前时间戳：', nowTime)
      console.log('是否在截止前：', isBeforeDeadline)
    } catch (e) {
      console.error('解析报名截止时间失败：', e)
      isBeforeDeadline = false
    }
  } else {
    // 无截止时间 → 可报名
    isBeforeDeadline = true
    console.log('无截止时间，时间校验通过')
  }

  // 最终结果
  const canSignupResult = isStatusValid && isNotSignedUp && isNotFull && isBeforeDeadline
  console.log('最终是否可报名：', canSignupResult)
  console.log('========================')

  return canSignupResult
})

// 修复：取消报名也添加 published 状态
const canCancel = computed(() => {
  if (!activityDetail.value) return false
  const { status } = activityDetail.value
  return hasSignup.value && ['pending', 'approved', 'ongoing', 'published'].includes(status)
})

// 新增：获取报名禁用的具体提示
const getSignupDisabledTip = () => {
  if (!activityDetail.value) return '活动信息未加载完成'
  
  const { status, currentMembers, maxMembers, signupEndTime } = activityDetail.value
  
  // 时间原因
  if (signupEndTime) {
    try {
      const deadlineTime = new Date(signupEndTime).getTime()
      const nowTime = new Date().getTime()
      if (deadlineTime <= nowTime) {
        return `报名已截止（截止时间：${formatTime(signupEndTime)}）`
      }
    } catch (e) {
      return '报名截止时间格式错误'
    }
  }
  
  // 人数原因
  if (maxMembers && currentMembers >= maxMembers) {
    return '活动已报满，无法报名'
  }
  
  // 状态原因：更新状态文本，包含 published
  if (!['pending', 'approved', 'ongoing', 'published'].includes(status)) {
    return `当前活动状态为${getActivityStatusText(status)}，无法报名`
  }
  
  // 已报名原因
  if (hasSignup.value) {
    return '您已报名该活动，无需重复报名'
  }
  
  // 兜底提示
  return '暂无法报名该活动'
}

// 时间格式化函数（适配ISO时间）
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  try {
    const date = new Date(timeStr)
    const padZero = (num) => num.toString().padStart(2, '0')
    const year = date.getFullYear()
    const month = padZero(date.getMonth() + 1)
    const day = padZero(date.getDate())
    const hours = padZero(date.getHours())
    const minutes = padZero(date.getMinutes())
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (e) {
    return timeStr
  }
}

// 活动状态标签类型：添加 published 的标签类型
const getActivityStatusTagType = (status) => {
  const typeMap = {
    pending: 'warning',
    approved: 'primary',
    ongoing: 'success',
    published: 'primary', // 已发布和已审核用相同标签
    completed: 'info',
    cancelled: 'danger',
    rejected: 'danger'
  }
  return typeMap[status] || 'default'
}

// 活动状态文本：添加 published 的文本
const getActivityStatusText = (status) => {
  const textMap = {
    pending: '待审核',
    approved: '已审核',
    ongoing: '进行中',
    published: '已发布', // 补充已发布的文本
    completed: '已完成',
    cancelled: '已取消',
    rejected: '已驳回'
  }
  return textMap[status] || '未知状态'
}

// 获取活动详情
const getActivityDetailData = async () => {
  if (!activityId.value) {
    ElMessage.error('活动ID不能为空')
    return
  }
  try {
    loading.value = true
    const res = await getActivityDetail(activityId.value)
    activityDetail.value = res.data || res
    hasSignup.value = !!activityDetail.value.hasSignup
    console.log('加载活动详情：', activityDetail.value)
  } catch (error) {
    console.error('获取活动详情失败：', error)
    ElMessage.error(`获取详情失败：${error.message || '网络异常'}`)
  } finally {
    loading.value = false
  }
}

// 报名活动
const handleSignup = async () => {
  try {
    await ElMessageBox.confirm('确认报名该活动？', '报名确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await signupActivity(activityId.value)
    ElMessage.success('报名成功！')
    hasSignup.value = true
    await getActivityDetailData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('报名失败：', error)
      ElMessage.error(`报名失败：${error.message || '操作异常'}`)
    }
  }
}

// 取消报名
const handleCancelSignup = async () => {
  try {
    await ElMessageBox.confirm('确认取消报名？取消后将失去活动参与资格', '取消报名', {
      confirmButtonText: '确认取消',
      cancelButtonText: '取消',
      type: 'danger'
    })
    await cancelActivitySignup(activityId.value)
    ElMessage.success('取消报名成功！')
    hasSignup.value = false
    await getActivityDetailData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消报名失败：', error)
      ElMessage.error(`取消失败：${error.message || '操作异常'}`)
    }
  }
}

// 返回列表
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/home/activity/list')
  }
}

// 挂载时加载数据
onMounted(() => {
  getActivityDetailData()
})
</script>

<style scoped>
.activity-detail-container {
  padding: 24px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 120px);
}

.activity-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8eaec;
}

.activity-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.activity-info {
  padding: 20px;
}

.desc-content {
  white-space: pre-wrap;
  text-align: left;
  line-height: 1.6;
  color: #4b5563;
  padding: 8px 0;
}

.activity-btn-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid #e8eaec;
  margin-top: 16px;
}

.text-warning {
  color: #f59e0b !important;
  font-weight: 500;
}

@media (max-width: 768px) {
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .activity-btn-group {
    flex-direction: column;
  }
  
  .el-descriptions {
    --el-descriptions-column: 1 !important;
  }
}
</style>
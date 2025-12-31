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
          <!-- 核心修改：tooltip 显示后端返回的禁用原因，无则显示默认 -->
          <el-tooltip v-if="!canSignup" :content="activityDetail.signupDisabledReason || '仅待审核/已审核/进行中的活动可报名，且活动未报满'" placement="top">
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
          <el-tooltip v-if="!canCancel" content="仅已报名的待审核/已审核/进行中活动可取消" placement="top">
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

// 计算属性：判断是否可报名/取消（优化逻辑）
const canSignup = computed(() => {
  if (!activityDetail.value) return false
  const { status, currentMembers, maxMembers, signupDeadline } = activityDetail.value
  // 1. 活动状态为待审核/已审核/进行中 2. 未报名 3. 未报满 4. 未过报名截止时间
  const isStatusValid = ['pending', 'approved', 'ongoing'].includes(status)
  const isNotFull = maxMembers ? currentMembers < maxMembers : true
  const isBeforeDeadline = signupDeadline ? new Date(signupDeadline) > new Date() : true
  return isStatusValid && !hasSignup.value && isNotFull && isBeforeDeadline
})

const canCancel = computed(() => {
  if (!activityDetail.value) return false
  const { status } = activityDetail.value
  // 1. 已报名 2. 活动状态为待审核/已审核/进行中
  return hasSignup.value && ['pending', 'approved', 'ongoing'].includes(status)
})

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
    const seconds = padZero(date.getSeconds())
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return timeStr // 解析失败则返回原字符串
  }
}

// 活动状态标签类型
const getActivityStatusTagType = (status) => {
  const typeMap = {
    pending: 'warning',     // 待审核
    approved: 'primary',    // 已审核（优化为primary更区分）
    ongoing: 'success',     // 进行中
    completed: 'info',      // 已完成
    cancelled: 'danger',    // 已取消
    rejected: 'danger'      // 已驳回
  }
  return typeMap[status] || 'default'
}

// 核心修改：将未知状态替换为和signupDisabledReason一致的逻辑（优先取后端返回，无则按状态匹配，最后兜底为报名相关提示）
const getActivityStatusText = (status) => {
  // 优先使用后端返回的禁用原因（如果有）
  if (activityDetail.value?.signupDisabledReason) {
    return activityDetail.value.signupDisabledReason
  }
  // 常规状态映射
  const textMap = {
    pending: '待审核',
    approved: '已审核',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    rejected: '已驳回'
  }
  // 兜底：替换原"未知状态"为和禁用原因一致的提示
  return textMap[status] || '报名已截止'
}

// 获取活动详情（优化错误处理）
const getActivityDetailData = async () => {
  if (!activityId.value) {
    ElMessage.error('活动ID不能为空')
    return
  }
  try {
    loading.value = true
    const res = await getActivityDetail(activityId.value)
    // 适配后端响应：优先取res.data，若后端直接返回对象则取res
    activityDetail.value = res.data || res
    // 从后端获取是否已报名（核心适配点）
    hasSignup.value = !!activityDetail.value.hasSignup // 后端返回的报名状态
  } catch (error) {
    console.error('获取活动详情失败：', error)
    ElMessage.error(`获取详情失败：${error.message || '网络异常'}`)
  } finally {
    loading.value = false
  }
}

// 报名活动（增加二次确认）
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
    // 刷新详情（更新人数/状态）
    await getActivityDetailData()
  } catch (error) {
    if (error !== 'cancel') { // 排除用户取消确认的情况
      console.error('报名失败：', error)
      ElMessage.error(`报名失败：${error.message || '操作异常'}`)
    }
  }
}

// 取消报名（增加二次确认）
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
    // 刷新详情
    await getActivityDetailData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消报名失败：', error)
      ElMessage.error(`取消失败：${error.message || '操作异常'}`)
    }
  }
}

// 返回列表（支持回退历史）
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

/* 简介内容样式优化 */
.desc-content {
  white-space: pre-wrap;
  text-align: left;
  line-height: 1.6;
  color: #4b5563;
  padding: 8px 0;
}

/* 按钮组样式 */
.activity-btn-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid #e8eaec;
  margin-top: 16px;
}

/* 满员提示样式 */
.text-warning {
  color: #f59e0b !important;
  font-weight: 500;
}

/* 适配小屏幕 */
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
<template>
  <div class="activity-management">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>活动管理</span>
          <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane label="活动列表" name="list"></el-tab-pane>
            <el-tab-pane label="我的报名记录" name="myRecords"></el-tab-pane>
          </el-tabs>
        </div>
      </template>

      <!-- 活动列表标签页 -->
      <div v-if="activeTab === 'list'">
        <el-input v-model="searchKeyword" placeholder="搜索活动名称" style="width: 300px; margin-bottom: 20px"></el-input>
        <el-table :data="activityList" border style="width: 100%">
          <el-table-column prop="id" label="活动ID" width="80"></el-table-column>
          <el-table-column prop="name" label="活动名称" min-width="180"></el-table-column>
          <el-table-column prop="clubName" label="举办社团" width="150"></el-table-column>
          <el-table-column prop="time" label="活动时间" width="200"></el-table-column>
          <el-table-column prop="status" label="活动状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === '未开始' ? 'info' : (scope.row.status === '进行中' ? 'success' : 'danger')">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewActivityDetail(scope.row)">查看详情</el-button>
              <el-button 
                type="success" 
                size="small" 
                @click="signUpActivity(scope.row.id)"
                :disabled="scope.row.status !== '未开始' || scope.row.hasSignUp"
              >
                {{ scope.row.hasSignUp ? '已报名' : '报名' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 20px; text-align: right"
        >
        </el-pagination>
      </div>

      <!-- 我的报名记录标签页 -->
      <div v-if="activeTab === 'myRecords'">
        <el-table :data="mySignUpRecords" border style="width: 100%">
          <el-table-column prop="activityName" label="活动名称" min-width="180"></el-table-column>
          <el-table-column prop="clubName" label="举办社团" width="150"></el-table-column>
          <el-table-column prop="signUpTime" label="报名时间" width="200"></el-table-column>
          <el-table-column prop="activityStatus" label="活动状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.activityStatus === '未开始' ? 'info' : (scope.row.activityStatus === '进行中' ? 'success' : 'danger')">
                {{ scope.row.activityStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button 
                type="danger" 
                size="small" 
                @click="cancelSignUp(scope.row.id)"
                :disabled="scope.row.activityStatus !== '未开始'"
              >
                取消报名
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 活动详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="活动详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动ID">{{ currentActivity.id }}</el-descriptions-item>
        <el-descriptions-item label="活动名称">{{ currentActivity.name }}</el-descriptions-item>
        <el-descriptions-item label="举办社团">{{ currentActivity.clubName }}</el-descriptions-item>
        <el-descriptions-item label="活动时间">{{ currentActivity.time }}</el-descriptions-item>
        <el-descriptions-item label="活动地点">{{ currentActivity.location }}</el-descriptions-item>
        <el-descriptions-item label="报名截止时间">{{ currentActivity.signUpDeadline }}</el-descriptions-item>
        <el-descriptions-item label="活动简介" :span="2">{{ currentActivity.description }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 关键修改：给导入的API函数加别名，避免和页面内函数重名
import { 
  getActivityList, 
  getActivityDetail, 
  signUpActivity as apiSignUpActivity, // 加别名
  cancelSignUp as apiCancelSignUp,     // 加别名
  getMySignUpRecords 
} from '../api/activity'

// 响应式数据（保持不变）
const activeTab = ref('list')
const searchKeyword = ref('')
const activityList = ref([])
const mySignUpRecords = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const currentActivity = ref({})

// 初始化加载数据（保持不变）
onMounted(() => {
  fetchActivityList()
  fetchMySignUpRecords()
})

// 分页查询活动列表（保持不变）
const fetchActivityList = async () => {
  try {
    const res = await getActivityList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })
    activityList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取活动列表失败:', error)
  }
}

// 处理分页大小变化（保持不变）
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchActivityList()
}

// 处理当前页变化（保持不变）
const handleCurrentChange = (val) => {
  pageNum.value = val
  fetchActivityList()
}

// 标签页切换（保持不变）
const handleTabChange = (tab) => {
  if (tab === 'myRecords') {
    fetchMySignUpRecords()
  }
}

// 查看活动详情（保持不变）
const viewActivityDetail = async (row) => {
  try {
    const res = await getActivityDetail(row.id)
    currentActivity.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取活动详情失败:', error)
  }
}

// 报名活动（调用别名后的API函数）
const signUpActivity = async (activityId) => {
  try {
    await apiSignUpActivity({ activityId }) // 改用别名
    ElMessage.success('报名成功')
    fetchActivityList()
    fetchMySignUpRecords()
  } catch (error) {
    ElMessage.error('报名失败，请重试')
    console.error('报名活动失败:', error)
  }
}

// 取消报名（调用别名后的API函数）
const cancelSignUp = async (recordId) => {
  try {
    await apiCancelSignUp(recordId) // 改用别名
    ElMessage.success('取消报名成功')
    fetchActivityList()
    fetchMySignUpRecords()
  } catch (error) {
    ElMessage.error('取消报名失败，请重试')
    console.error('取消报名失败:', error)
  }
}

// 获取我的报名记录（保持不变）
const fetchMySignUpRecords = async () => {
  try {
    const res = await getMySignUpRecords()
    mySignUpRecords.value = res.data
  } catch (error) {
    console.error('获取报名记录失败:', error)
  }
}
</script>


<style scoped>
.activity-management {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
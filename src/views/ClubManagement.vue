<template>
  <div class="club-management">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>社团管理</span>
          <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane label="社团列表" name="list"></el-tab-pane>
            <el-tab-pane label="我加入的社团" name="myClubs"></el-tab-pane>
            <el-tab-pane label="我的申请记录" name="applyRecords"></el-tab-pane>
          </el-tabs>
        </div>
      </template>

      <!-- 社团列表标签页 -->
      <div v-if="activeTab === 'list'">
        <el-input v-model="searchKeyword" placeholder="搜索社团名称" style="width: 300px; margin-bottom: 20px"></el-input>
        <el-table :data="clubList" border style="width: 100%">
          <el-table-column prop="id" label="社团ID" width="80"></el-table-column>
          <el-table-column prop="name" label="社团名称" min-width="150"></el-table-column>
          <el-table-column prop="description" label="社团简介" min-width="300"></el-table-column>
          <el-table-column prop="memberCount" label="成员数" width="100"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewClubDetail(scope.row)">查看详情</el-button>
              <el-button type="success" size="small" @click="applyJoinClub(scope.row.id)">申请加入</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 20px; text-align: right"
        >
        </el-pagination>
      </div>

      <!-- 我加入的社团标签页 -->
      <div v-if="activeTab === 'myClubs'">
        <el-table :data="myClubList" border style="width: 100%">
          <el-table-column prop="id" label="社团ID" width="80"></el-table-column>
          <el-table-column prop="name" label="社团名称" min-width="150"></el-table-column>
          <el-table-column prop="description" label="社团简介" min-width="300"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewClubMembers(scope.row.id)">查看成员</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 我的申请记录标签页 -->
      <div v-if="activeTab === 'applyRecords'">
        <el-table :data="applyRecords" border style="width: 100%">
          <el-table-column prop="clubName" label="社团名称" min-width="150"></el-table-column>
          <el-table-column prop="applyTime" label="申请时间" width="200"></el-table-column>
          <el-table-column prop="status" label="审核状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === '审核中' ? 'warning' : (scope.row.status === '通过' ? 'success' : 'danger')">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 社团详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="社团详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="社团ID">{{ currentClub.id }}</el-descriptions-item>
        <el-descriptions-item label="社团名称">{{ currentClub.name }}</el-descriptions-item>
        <el-descriptions-item label="社团简介" :span="2">{{ currentClub.description }}</el-descriptions-item>
        <el-descriptions-item label="成立时间">{{ currentClub.createTime }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ currentClub.manager }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 社团成员弹窗 -->
    <el-dialog v-model="membersDialogVisible" title="社团成员列表" width="500px">
      <el-table :data="clubMembers" border style="width: 100%">
        <el-table-column prop="id" label="成员ID" width="80"></el-table-column>
        <el-table-column prop="name" label="成员姓名" width="120"></el-table-column>
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.role === '管理员'">管理员</el-tag>
            <el-tag v-else>普通成员</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 关键修改：给applyJoinClub加别名
import { 
  getClubList, 
  getClubDetail, 
  getMyClubs, 
  applyJoinClub as apiApplyJoinClub, // 加别名
  getClubMembers, 
  getMyApplyRecords 
} from '../api/club'

// 响应式数据（保持不变）
const activeTab = ref('list')
const searchKeyword = ref('')
const clubList = ref([])
const myClubList = ref([])
const applyRecords = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const membersDialogVisible = ref(false)
const currentClub = ref({})
const clubMembers = ref([])

// 初始化加载数据（保持不变）
onMounted(() => {
  fetchClubList()
  fetchMyClubs()
  fetchMyApplyRecords()
})

// 分页查询社团列表（保持不变）
const fetchClubList = async () => {
  try {
    const res = await getClubList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })
    clubList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取社团列表失败:', error)
  }
}

// 处理分页大小变化（保持不变）
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchClubList()
}

// 处理当前页变化（保持不变）
const handleCurrentChange = (val) => {
  pageNum.value = val
  fetchClubList()
}

// 标签页切换（保持不变）
const handleTabChange = (tab) => {
  if (tab === 'myClubs') {
    fetchMyClubs()
  } else if (tab === 'applyRecords') {
    fetchMyApplyRecords()
  }
}

// 查看社团详情（保持不变）
const viewClubDetail = async (row) => {
  try {
    const res = await getClubDetail(row.id)
    currentClub.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取社团详情失败:', error)
  }
}

// 申请加入社团（调用别名后的API函数）
const applyJoinClub = async (clubId) => {
  try {
    await apiApplyJoinClub({ clubId }) // 改用别名
    ElMessage.success('申请提交成功，请等待审核')
    fetchMyApplyRecords()
  } catch (error) {
    ElMessage.error('申请提交失败，请重试')
    console.error('申请加入社团失败:', error)
  }
}

// 查看社团成员（保持不变）
const viewClubMembers = async (clubId) => {
  try {
    const res = await getClubMembers(clubId)
    clubMembers.value = res.data
    membersDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取成员列表失败')
    console.error('获取社团成员失败:', error)
  }
}

// 获取我加入的社团（保持不变）
const fetchMyClubs = async () => {
  try {
    const res = await getMyClubs()
    myClubList.value = res.data
  } catch (error) {
    console.error('获取我加入的社团失败:', error)
  }
}

// 获取我的申请记录（保持不变）
const fetchMyApplyRecords = async () => {
  try {
    const res = await getMyApplyRecords()
    applyRecords.value = res.data
  } catch (error) {
    console.error('获取申请记录失败:', error)
  }
}
</script>

<style scoped>
.club-management {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
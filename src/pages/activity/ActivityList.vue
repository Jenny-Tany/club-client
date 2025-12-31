<template>
    <div class="activity-list-container">
      <!-- 搜索筛选栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入活动名称/简介关键词"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="所属社团">
          <el-select
            v-model="searchForm.clubId"
            placeholder="请选择社团"
            clearable
          >
            <el-option
              v-for="club in clubOptions"
              :key="club.id"
              :label="club.name"
              :value="club.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getActivityListData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 活动列表 -->
      <el-table :data="activityList" border style="width: 100%; margin-top: 20px" @row-click="goToDetail">
        <el-table-column prop="id" label="活动ID" width="80" align="center"></el-table-column>
        <el-table-column prop="title" label="活动名称" min-width="150" align="center"></el-table-column>
        <el-table-column prop="clubName" label="所属社团" width="120" align="center"></el-table-column>
        <!-- 核心修改：格式化开始时间 -->
        <el-table-column label="开始时间" width="180" align="center">
          <template #default="scope">
            {{ formatDateTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="活动地点" min-width="150" align="center"></el-table-column>
        <el-table-column prop="status" label="活动状态" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'ongoing'" type="success">进行中</el-tag>
            <el-tag v-else-if="scope.row.status === 'published'" type="primary">已发布</el-tag>
            <el-tag v-else-if="scope.row.status === 'pending' || scope.row.status === 'approved'" type="warning">待开展</el-tag>
            <el-tag v-else-if="scope.row.status === 'completed'" type="info">已完成</el-tag>
            <el-tag v-else type="danger">已取消/驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button type="text" @click="goToDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right"
      ></el-pagination>
  
      <!-- 空数据提示 -->
      <el-empty v-if="activityList.length === 0 && !loading" description="暂无活动数据"></el-empty>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { getActivityList } from '@/api/activity'
  import { getMyClub } from '@/api/club' // 拉取社团列表用于筛选
  
  const router = useRouter()
  const loading = ref(false)
  
  // 搜索筛选参数
  const searchForm = ref({
    keyword: '',
    clubId: ''
  })
  
  // 分页参数
  const pageNum = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  
  // 活动列表 + 社团筛选选项
  const activityList = ref([])
  const clubOptions = ref([])

  // 新增：时间格式化函数（适配ISO格式，兼容空值/无效时间）
  const formatDateTime = (dateStr) => {
    // 空值兜底
    if (!dateStr) return '暂无时间'
    // 解析时间
    const date = new Date(dateStr)
    // 兼容无效时间格式
    if (isNaN(date.getTime())) return '时间格式错误'
    // 补零处理：确保月份/日期/小时/分钟/秒数为2位
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    // 最终格式：2025-12-30 21:42:02（如需简化可去掉秒数）
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  
  // 获取活动列表数据
  const getActivityListData = async () => {
    try {
      loading.value = true
      const params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyword: searchForm.value.keyword,
        clubId: searchForm.value.clubId // 社团筛选参数
      }
      const res = await getActivityList(params)
      activityList.value = res.data.records
      total.value = res.data.total
    } catch (error) {
      console.error('获取活动列表失败：', error)
      ElMessage.error('获取活动列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 获取社团选项（用于筛选）
  const getClubOptions = async () => {
    try {
      const res = await getMyClub()
      clubOptions.value = res.data // 用我的社团作为筛选选项
    } catch (error) {
      console.error('获取社团选项失败：', error)
    }
  }
  
  // 重置搜索
  const resetSearch = () => {
    searchForm.value = {
      keyword: '',
      clubId: ''
    }
    pageNum.value = 1
    getActivityListData()
  }
  
  // 分页回调
  const handleSizeChange = (val) => {
    pageSize.value = val
    getActivityListData()
  }
  const handleCurrentChange = (val) => {
    pageNum.value = val
    getActivityListData()
  }
  
  // 跳转到活动详情
  const goToDetail = (row) => {
    router.push(`/home/activity/detail/${row.id}`)
  }
  
  // 页面挂载时加载数据
  onMounted(() => {
    getClubOptions()
    getActivityListData()
  })
  </script>
  
  <style scoped>
  .activity-list-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
  .search-form {
    margin-bottom: 10px;
  }
  </style>
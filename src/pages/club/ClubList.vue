<template>
    <div class="club-list-container">
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入社团名称/简介关键词"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getClubListData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 社团列表 -->
      <el-table :data="clubList" border style="width: 100%; margin-top: 20px" @row-click="goToDetail">
        <el-table-column prop="id" label="社团ID" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="社团名称" min-width="150" align="center"></el-table-column>
        <el-table-column prop="description" label="社团简介" min-width="300" align="center"></el-table-column>
        <el-table-column prop="leaderName" label="负责人" width="120" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'normal'" type="success">正常</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
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
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right"
      >
      </el-pagination>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getClubList } from '@/api/club'
  
  const router = useRouter()
  
  // 搜索表单
  const searchForm = ref({
    keyword: ''
  })
  
  // 分页参数
  const pageNum = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  
  // 社团列表
  const clubList = ref([])
  
  // 获取社团列表数据
  const getClubListData = async () => {
    try {
      const params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyword: searchForm.value.keyword
      }
      const res = await getClubList(params)
      clubList.value = res.data.records
      total.value = res.data.total
    } catch (error) {
      console.error('获取社团列表失败：', error)
    }
  }
  
  // 重置搜索
  const resetSearch = () => {
    searchForm.value.keyword = ''
    pageNum.value = 1
    getClubListData()
  }
  
  // 每页条数改变
  const handleSizeChange = (val) => {
    pageSize.value = val
    getClubListData()
  }
  
  // 当前页改变
  const handleCurrentChange = (val) => {
    pageNum.value = val
    getClubListData()
  }
  
  // 跳转到社团详情
  const goToDetail = (row) => {
    router.push(`/home/club/detail/${row.id}`)
  }
  
  // 页面挂载时加载数据
  onMounted(() => {
    getClubListData()
  })
  </script>
  
  <style scoped>
  .club-list-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
  
  .search-form {
    margin-bottom: 10px;
  }
  </style>
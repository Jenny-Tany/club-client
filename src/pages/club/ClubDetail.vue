<template>
    <div class="club-detail-container">
      <!-- 头部：标题 + 返回按钮 -->
      <div class="page-header">
        <el-button 
          type="primary" 
          icon="el-icon-arrow-left" 
          @click="goBack"
          style="margin-right: 10px"
        >
          返回
        </el-button>
        <span class="page-title">社团详情</span>
      </div>
  
      <!-- 加载状态 -->
      <el-skeleton v-if="loading" :rows="8" animated class="detail-card"></el-skeleton>
      
      <!-- 社团详情卡片（完全适配后端返回字段） -->
      <el-card v-else-if="clubDetail" shadow="hover" class="detail-card">
        <!-- 社团logo + 基础信息头部 -->
        <div class="club-header">
          <div class="logo-wrapper" v-if="clubDetail.logo">
            <el-image 
              :src="clubDetail.logo" 
              fit="cover" 
              alt="社团logo"
              class="club-logo"
              fallback="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-image>
          </div>
          <div class="basic-info">
            <h2 class="club-name">{{ clubDetail.name }}</h2>
            <div class="tag-group">
              <el-tag 
                v-if="clubDetail.status === 'normal'" 
                type="success"
              >
                正常运营
              </el-tag>
              <el-tag 
                v-if="clubDetail.status === 'disabled'" 
                type="danger"
              >
                已停用
              </el-tag>
              <el-tag type="info">成员数：{{ clubDetail.memberCount }}</el-tag>
            </div>
          </div>
        </div>
  
        <!-- 详细信息表格 -->
        <el-divider content-position="left">社团信息</el-divider>
        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="社团ID">{{ clubDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="创建管理员">{{ clubDetail.createUsername || '-' }}</el-descriptions-item>
          <el-descriptions-item label="社团简介" :span="2">
            {{ clubDetail.description || '暂无简介' }}
          </el-descriptions-item>
          <el-descriptions-item label="加入状态" :span="2">
            <el-tag 
              v-if="clubDetail.isJoined" 
              type="success"
            >
              已加入（{{ clubDetail.memberRole || '普通成员' }}）
            </el-tag>
            <el-tag 
              v-else 
              type="info"
            >
              未加入
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDateTime(clubDetail.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ formatDateTime(clubDetail.updateTime) }}</el-descriptions-item>
        </el-descriptions>
  
        <!-- 操作按钮区 -->
        <div class="action-buttons">
          <el-button 
            v-if="!clubDetail.isJoined"
            type="primary"
            icon="el-icon-user-add"
            @click="handleJoinClub"
          >
            申请加入社团
          </el-button>
          <el-button 
            v-if="clubDetail.isJoined"
            type="danger"
            icon="el-icon-user-delete"
            @click="handleQuitClub"
          >
            退出社团
          </el-button>
        </div>
      </el-card>
  
      <!-- 空数据提示 -->
      <el-empty 
        v-else 
        description="暂无该社团的详细信息"
        class="empty-tip"
      >
        <el-button type="primary" @click="goBack">返回社团列表</el-button>
      </el-empty>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getClubDetail, joinClub, quitClub } from '@/api/club'
  
  // 1. 路由相关
  const route = useRoute()
  const router = useRouter()
  const clubId = route.params.id // 匹配路由中的:id参数
  
  // 2. 状态管理
  const loading = ref(true)
  const clubDetail = ref(null) // 社团详情数据
  
  // 3. 时间格式化（适配后端ISO时间）
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  
  // 4. 返回上一页
  const goBack = () => {
    router.go(-1) // 通用回退，也可指定路径：router.push('/home/club/list')
  }
  
  // 5. 获取社团详情数据
  const getClubDetailData = async () => {
    if (!clubId) {
      loading.value = false
      ElMessage.warning('未获取到社团ID')
      return
    }
  
    try {
      const res = await getClubDetail(clubId)
      clubDetail.value = res.data // 适配后端返回的data对象
    } catch (error) {
      console.error('获取社团详情失败：', error)
      ElMessage.error('获取社团详情失败，请稍后重试')
      clubDetail.value = null
    } finally {
      loading.value = false
    }
  }
  
  // 6. 申请加入社团
  const handleJoinClub = async () => {
    try {
      await ElMessageBox.confirm(
        '确定要申请加入该社团吗？',
        '申请加入社团',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await joinClub(clubId)
      ElMessage.success('申请提交成功！请等待管理员审核')
      getClubDetailData() // 刷新详情数据
    } catch (error) {
      if (error !== 'cancel') {
        console.error('申请加入失败：', error)
        ElMessage.error(error.message || '申请加入失败，请稍后重试')
      }
    }
  }
  
  // 7. 退出社团
  const handleQuitClub = async () => {
    try {
      await ElMessageBox.confirm(
        '确定要退出该社团吗？',
        '退出社团',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await quitClub(clubId)
      ElMessage.success('退出社团成功！')
      getClubDetailData()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('退出社团失败：', error)
        ElMessage.error('退出社团失败，请稍后重试')
      }
    }
  }
  
  // 页面挂载时加载数据
  onMounted(() => {
    getClubDetailData()
  })
  </script>
  
  <style scoped>
  /* 页面容器（修复原样式类名错误） */
  .club-detail-container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 120px);
  }
  
  /* 头部标题+返回按钮 */
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
  }
  
  .page-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  /* 详情卡片 */
  .detail-card {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
    padding: 0;
  }
  
  /* 社团头部（logo+基础信息） */
  .club-header {
    display: flex;
    gap: 20px;
    padding: 20px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .logo-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #e6e6e6;
  }
  
  .club-logo {
    width: 100%;
    height: 100%;
  }
  
  .basic-info {
    flex: 1;
    min-width: 200px;
  }
  
  .club-name {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .tag-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  /* 操作按钮区 */
  .action-buttons {
    padding: 15px 20px;
    border-top: 1px solid #e6e6e6;
    display: flex;
    gap: 10px;
  }
  
  /* 空数据提示 */
  .empty-tip {
    margin-top: 50px;
    text-align: center;
  }
  
  /* 骨架屏适配 */
  .el-skeleton.detail-card {
    padding: 20px;
  }
  </style>
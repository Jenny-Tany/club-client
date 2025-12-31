<template>
    <div class="user-info-container">
      <el-card title="个人信息详情" shadow="hover" class="info-card">
        <el-form
          ref="userInfoFormRef"
          :model="userInfo"
          label-width="100px"
          class="info-form"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学号" prop="studentId">
                <el-input v-model="userInfo.studentId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="userInfo.realName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userInfo.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="userInfo.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色" prop="role">
                <el-input v-model="userInfo.role" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="btn-group">
            <el-button type="primary" @click="handleUpdateUserInfo">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getUserInfo, updateUserInfo } from '@/api/user'
  import { useUserStore } from '@/pinia/userStore'
  
  const userStore = useUserStore()
  const userInfoFormRef = ref(null)
  const userInfo = ref({
    username: '',
    realName: '',
    studentId: '',
    email: '',
    phone: '',
    role: ''
  })
  
  // 获取个人信息
  const getUserInfoData = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data // 赋值用户信息
    } catch (error) {
      console.error('获取个人信息失败：', error)
      ElMessage.error('获取个人信息失败')
    }
  }
  
  // 修改个人信息
  const handleUpdateUserInfo = async () => {
    try {
      await userInfoFormRef.value.validate()
      await updateUserInfo(userInfo.value)
      ElMessage.success('修改个人信息成功')
      // 刷新pinia中的用户信息
      getUserInfoData()
    } catch (error) {
      console.error('修改个人信息失败：', error)
      ElMessage.error('修改个人信息失败')
    }
  }
  
  onMounted(() => {
    getUserInfoData()
  })
  </script>
  
  <style scoped>
  .user-info-container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 120px);
  }
  .info-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
  .info-form {
    margin-top: 20px;
  }
  .btn-group {
    text-align: center;
    margin-top: 30px;
  }
  </style>
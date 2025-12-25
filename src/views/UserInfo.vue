<template>
  <div class="user-info-container">
    <el-card shadow="hover">
      <template #header>
        <h2>个人信息</h2>
      </template>
      <el-form :model="userInfo" label-width="100px" style="margin-top: 20px;">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="userInfo.realName"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="userInfo.studentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button type="primary" @click="handleUpdate">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCurrentUser, updateUser } from '../api/user'

const userInfo = ref({})

// 初始化获取用户信息
onMounted(() => {
  fetchCurrentUser()
})

// 获取当前用户信息
const fetchCurrentUser = async () => {
  try {
    const res = await getCurrentUser()
    userInfo.value = res.data
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 保存用户信息修改
const handleUpdate = async () => {
  try {
    const res = await updateUser(userInfo.value)
    ElMessage.success(res.message)
  } catch (error) {
    ElMessage.error('更新信息失败')
  }
}
</script>

<style scoped>
.user-info-container {
  padding: 20px;
}
</style>
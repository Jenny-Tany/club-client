<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">校园社团活动平台 - 登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="login-btn-group">
          <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
          <el-button type="text" @click="goToRegister">去注册</el-button>
        </el-form-item>
      </el-form>
      <div class="test-account-tip">
        <p>测试账号：</p>
        <p>普通用户：test_user / 123456</p>
        <p>社团管理员：club_admin / 123456</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userLogin } from '@/api/user'
import { useUserStore } from '@/pinia/userStore'
import { getUserInfo } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

// 表单校验规则
const loginRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 登录处理
const handleLogin = async () => {
  try {
    // 表单校验
    await loginFormRef.value.validate()
    loading.value = true
    // 调用登录接口
    const res = await userLogin(loginForm.value)
    // 保存Token
    userStore.login(res.data.token, {})
    // 获取用户信息
    const userRes = await getUserInfo()
    userStore.userInfo = userRes.data
    // 跳转首页
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error) {
    console.error('登录失败：', error)
  } finally {
    loading.value = false
  }
}

// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #1989fa;
}

.login-form {
  margin-bottom: 20px;
}

.login-btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-account-tip {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}
</style>
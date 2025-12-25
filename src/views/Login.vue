<template>
  <div class="login-page">
    <!-- 左侧装饰区 -->
    <div class="login-banner">
      <div class="banner-content">
        <h1>校园社团管理系统</h1>
        <p>加入我们，探索更多精彩</p>
      </div>
    </div>
    <!-- 右侧登录表单区 -->
    <div class="login-form-wrapper">
      <div class="login-card">
        <div class="login-title">
          <h2>用户登录</h2>
          <p>欢迎回来，请登录您的账号</p>
        </div>
        <el-form 
          :model="loginForm" 
          label-width="0px" 
          class="login-form"
          :rules="loginRules"
          ref="loginFormRef"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
              prefix-icon="User"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-actions">
            <el-button 
              type="primary" 
              size="large"
              class="login-btn"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
          <div class="register-link">
            还没有账号？<span @click="toRegister">立即注册</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userLogin } from '../api/user'

const router = useRouter()
const loginFormRef = ref(null)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单校验规则
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 处理登录
const handleLogin = async () => {
  // 表单校验
  try {
    await loginFormRef.value.validate()
    const res = await userLogin(loginForm)
    ElMessage.success(res.message)
    localStorage.setItem('token', res.data.token)
    router.push('/clubs')
  } catch (error) {
    if (error.name !== 'ValidationError') {
      ElMessage.error('登录失败，请重试')
    }
  }
}

// 跳转到注册页面
const toRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
/* 整体页面布局 */
.login-page {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
}

/* 左侧banner区 */
.login-banner {
  flex: 1;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 40px;
}

.banner-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 600;
}

.banner-content p {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}

/* 右侧表单区 */
.login-form-wrapper {
  flex: 0 0 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.login-card {
  width: 100%;
  padding: 0 40px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
}

.login-title h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.login-title p {
  color: #999;
  font-size: 14px;
}

/* 表单样式 */
.login-form {
  width: 100%;
}

.form-input {
  margin-bottom: 20px;
  border-radius: 8px;
}

.form-actions {
  margin-bottom: 15px;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, #4361ee, #3a0ca3);
  border: none;
  font-size: 16px;
}

/* 注册链接 */
.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link span {
  color: #4361ee;
  cursor: pointer;
  font-weight: 500;
}

.register-link span:hover {
  color: #3a0ca3;
}
</style>
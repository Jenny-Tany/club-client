<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-bg-decoration">
      <div class="circle circle1"></div>
      <div class="circle circle2"></div>
      <div class="circle circle3"></div>
    </div>
    
    <el-card class="login-card">
      <!-- 登录logo/标题区 -->
      <div class="login-header">
        <div class="login-logo">
          <i class="el-icon-s-school"></i>
        </div>
        <h2 class="login-title">校园社团活动平台</h2>
        <p class="login-subtitle">Campus Club Activity Platform</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        class="login-form"
        size="large"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username" class="form-item">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            class="login-input"
            prefix-icon="el-icon-user"
            :class="{ 'input-focus': isUsernameFocus }"
            @focus="isUsernameFocus = true"
            @blur="isUsernameFocus = false"
          ></el-input>
        </el-form-item>
        
        <!-- 密码输入框 -->
        <el-form-item prop="password" class="form-item">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            class="login-input"
            prefix-icon="el-icon-lock"
            :class="{ 'input-focus': isPasswordFocus }"
            @focus="isPasswordFocus = true"
            @blur="isPasswordFocus = false"
          ></el-input>
        </el-form-item>
        
        <!-- 登录按钮 -->
        <el-form-item class="login-btn-group">
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
        
        <!-- 注册链接 -->
        <el-form-item class="register-link">
          <el-button 
            type="text" 
            @click="goToRegister"
            class="register-btn"
          >
            还没有账号？立即注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 测试账号提示 -->
      <div class="test-account-tip">
        <p class="tip-title"> 测试账号</p>
        <div class="account-list">
          <div class="account-item">
            <span class="role">普通用户：</span>
            <span class="account">test_user / 123456</span>
          </div>
        </div>
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

// 输入框聚焦状态（解决样式错乱）
const isUsernameFocus = ref(false)
const isPasswordFocus = ref(false)

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
    ElMessage.error('登录失败，请检查账号密码')
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
/* 全局容器 */
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 100%);
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 背景装饰圆 */
.login-bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.08);
}

.circle1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.circle2 {
  width: 200px;
  height: 200px;
  bottom: -80px;
  left: -80px;
}

.circle3 {
  width: 150px;
  height: 150px;
  top: 40%;
  left: 10%;
}

/* 登录卡片 - 核心修复：解决卡片内边距/边框冲突 */
.login-card {
  width: 420px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.15);
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
  box-sizing: border-box; /* 关键：防止内边距导致宽度溢出 */
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(64, 158, 255, 0.2);
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  width: 80px;
  height: 80px;
  line-height: 80px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 50%;
  margin: 0 auto 15px;
  color: white;
  font-size: 36px;
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

/* 表单样式 - 核心修复：清除自定义容器导致的冲突 */
.login-form {
  margin-bottom: 20px;
  width: 100%;
}

/* 表单项 - 修复间距和边框 */
.form-item {
  margin-bottom: 18px;
  width: 100%;
}

/* 输入框样式 - 核心修复：使用Element原生样式+轻量定制 */
.login-input {
  width: 100%;
  height: 50px;
  border-radius: 8px !important;
  border: 1px solid #e2e8f0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  transition: all 0.2s ease !important;
}

/* 输入框聚焦态 - 修复红框/重叠问题 */
.login-input.input-focus,
.login-input:focus,
.login-input:focus-within {
  border-color: #409eff !important;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1) !important;
  outline: none !important;
}

/* 占位符样式优化 */
:deep(.el-input__placeholder) {
  color: #cbd5e1 !important;
  font-size: 14px;
}

/* 输入框图标样式 */
:deep(.el-input__prefix) {
  left: 15px !important;
  color: #94a3b8 !important;
}

/* 按钮组 */
.login-btn-group {
  margin-top: 10px;
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 8px !important;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%) !important;
  border: none !important;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #3390e7 0%, #5aa7f5 100%) !important;
  transform: translateY(-2px);
}

.login-btn:active {
  transform: translateY(0);
}

/* 注册链接 */
.register-link {
  margin-top: 10px;
  text-align: center;
  width: 100%;
}

.register-btn {
  color: #409eff;
  font-size: 14px;
  padding: 0;
}

.register-btn:hover {
  color: #3390e7;
}

/* 测试账号提示 */
.test-account-tip {
  margin-top: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
}

.tip-title {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.account-list {
  font-size: 13px;
  color: #64748b;
}

.account-item {
  display: flex;
  margin-bottom: 5px;
  line-height: 1.5;
}

.account-item:last-child {
  margin-bottom: 0;
}

.role {
  color: #475569;
  font-weight: 500;
  min-width: 70px;
}

.account {
  color: #64748b;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 30px 20px;
  }
  
  .login-logo {
    width: 60px;
    height: 60px;
    font-size: 28px;
    line-height: 60px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .login-input {
    height: 46px;
  }
  
  .login-btn {
    height: 46px;
  }
}

/* 清除默认样式冲突 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

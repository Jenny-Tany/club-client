<template>
  <div class="register-page">
    <!-- 左侧装饰区 -->
    <div class="register-banner">
      <div class="banner-content">
        <h1>校园社团管理系统</h1>
        <p>注册账号，开启你的社团之旅</p>
      </div>
    </div>
    <!-- 右侧注册表单区 -->
    <div class="register-form-wrapper">
      <div class="register-card">
        <div class="register-title">
          <h2>用户注册</h2>
          <p>填写以下信息，创建你的账号</p>
        </div>
        <el-form 
          :model="registerForm" 
          label-width="0px" 
          class="register-form"
          :rules="registerRules"
          ref="registerFormRef"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="registerForm.username" 
              placeholder="请输入用户名"
              prefix-icon="User"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="registerForm.password" 
              type="password" 
              placeholder="请输入密码（不少于6位）"
              prefix-icon="Lock"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="realName">
            <el-input 
              v-model="registerForm.realName" 
              placeholder="请输入真实姓名"
              prefix-icon="UserFilled"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="studentId">
            <el-input 
              v-model="registerForm.studentId" 
              placeholder="请输入学号"
              prefix-icon="Ticket"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-actions">
            <el-button 
              type="primary" 
              size="large"
              class="register-btn"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
          <div class="login-link">
            已有账号？<span @click="toLogin">立即登录</span>
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
import { userRegister } from '../api/user'

const router = useRouter()
const registerFormRef = ref(null)

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  realName: '',
  studentId: ''
})

// 表单校验规则
const registerRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
  ],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }]
})

// 处理注册
const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    const res = await userRegister(registerForm)
    ElMessage.success(res.message)
    router.push('/login')
  } catch (error) {
    if (error.name !== 'ValidationError') {
      ElMessage.error('注册失败，请重试')
    }
  }
}

// 跳转到登录页面
const toLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 整体页面布局 */
.register-page {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
}

/* 左侧banner区 */
.register-banner {
  flex: 1;
  background: linear-gradient(135deg, #f72585 0%, #4cc9f0 100%);
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
.register-form-wrapper {
  flex: 0 0 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.register-card {
  width: 100%;
  padding: 0 40px;
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
}

.register-title h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.register-title p {
  color: #999;
  font-size: 14px;
}

/* 表单样式 */
.register-form {
  width: 100%;
}

.form-input {
  margin-bottom: 18px;
  border-radius: 8px;
}

.form-actions {
  margin-bottom: 15px;
}

.register-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f72585, #4cc9f0);
  border: none;
  font-size: 16px;
}

/* 登录链接 */
.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link span {
  color: #f72585;
  cursor: pointer;
  font-weight: 500;
}

.login-link span:hover {
  color: #c71585;
}
</style>
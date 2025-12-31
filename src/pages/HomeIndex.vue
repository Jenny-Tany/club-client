<template>
  <div class="home-index-container">
    <!-- 顶部banner区域 -->
    <div class="home-banner">
      <div class="banner-bg"></div>
      <div class="banner-content">
        <h1 class="banner-title">校园社团活动平台</h1>
        <p class="banner-subtitle">在这里，发现兴趣，遇见同频的人</p>
        <el-button 
          type="primary" 
          size="large" 
          class="banner-btn"
          @click="scrollToContent"
        >
          探索精彩
        </el-button>
      </div>
    </div>

    <!-- 核心内容区 -->
    <div class="home-content" id="main-content">
      <!-- 功能入口卡片 -->
      <div class="function-cards">
        <div class="card-item">
          <div class="card-icon club-icon">
            <i>01</i>
          </div>
          <h3 class="card-title">社团中心</h3>
          <p class="card-desc">浏览全校社团，加入感兴趣的组织</p>
          <el-button type="text" class="card-link">立即查看 →</el-button>
        </div>

        <div class="card-item">
          <div class="card-icon activity-icon">
            <i>02</i>
          </div>
          <h3 class="card-title">活动广场</h3>
          <p class="card-desc">参与丰富社团活动，体验多彩校园生活</p>
          <el-button type="text" class="card-link">立即参与 →</el-button>
        </div>

        <div class="card-item">
          <div class="card-icon mine-icon">
            <i>03</i>
          </div>
          <h3 class="card-title">我的中心</h3>
          <p class="card-desc">管理我的社团和活动报名信息</p>
          <el-button type="text" class="card-link">我的主页 →</el-button>
        </div>
      </div>

      <!-- 欢迎语区域 -->
      <div class="welcome-section">
        <div class="welcome-card">
          <h2 class="welcome-title">欢迎来到学生端系统</h2>
          <p class="welcome-desc">
            请从左侧菜单栏选择您想要使用的功能，
            探索校园社团的无限可能，
            参与精彩的校园活动，
            让大学生活更加充实有趣！
          </p>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="home-footer">
      <p>© 2025 校园社团活动平台 - 学生端</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 滚动到内容区
const scrollToContent = () => {
  const content = document.getElementById('main-content')
  content.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* 全局容器 */
.home-index-container {
  width: 100%;
  min-height: 100vh;
  background-color: #eef5fc;
  overflow-x: hidden;
}

/* Banner区域 */
.home-banner {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(118, 191, 240);
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 50%, #8cc0ff 100%);
  /* 叠加纹理效果 */
  background-image: 
    radial-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    radial-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 20px;
  animation: fadeInUp 1s ease;
}

.banner-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.banner-subtitle {
  font-size: 20px;
  margin: 0 0 30px;
  opacity: 0.9;
}

.banner-btn {
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  background: white;
  color: #409eff;
  border: none;
  transition: all 0.3s ease;
}

.banner-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.2);
  background: white;
  color: #409eff;
}

/* 核心内容区 */
.home-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* 功能卡片区域 */
.function-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.card-item {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.card-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border-color: #e8f4f8;
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 32px;
  color: white;
}

.club-icon {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

.activity-icon {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.mine-icon {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px;
}

.card-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px;
}

.card-link {
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
  padding: 0;
}

.card-link:hover {
  color: #3390e7;
}

/* 欢迎语区域 */
.welcome-section {
  background: white;
  border-radius: 16px;
  padding: 50px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.welcome-title {
  font-size: 28px;
  color: #1f2937;
  margin: 0 0 20px;
  font-weight: 600;
}

.welcome-desc {
  font-size: 16px;
  color: #64748b;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
}

/* 底部信息 */
.home-footer {
  text-align: center;
  padding: 30px 20px;
  color: #94a3b8;
  font-size: 14px;
  border-top: 1px solid #f0f0f0;
  margin-top: 60px;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .banner-title {
    font-size: 36px;
  }
  
  .banner-subtitle {
    font-size: 18px;
  }
  
  .home-content {
    padding: 40px 20px;
  }
  
  .function-cards {
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .card-item {
    padding: 30px 20px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .welcome-section {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .banner-title {
    font-size: 28px;
  }
  
  .card-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
}
</style>
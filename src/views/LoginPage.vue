<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>

    <div class="login-content">
      <!-- 左侧信息区域 -->
      <div class="info-section">
        <div class="brand-info">
          <div class="brand-logo">
            <BeakerIcon class="h-12 w-12 text-white" />
          </div>
          <h1 class="brand-title">溯农云链</h1>
          <p class="brand-subtitle">Agricultural Traceability Cloud Chain</p>
          <div class="feature-list">
            <div class="feature-item">
              <ShieldCheckIcon class="h-5 w-5" />
              <span>区块链技术保障数据安全</span>
            </div>
            <div class="feature-item">
              <QrCodeIcon class="h-5 w-5" />
              <span>全链路溯源追踪</span>
            </div>
            <div class="feature-item">
              <ChartBarIcon class="h-5 w-5" />
              <span>智能数据分析</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div class="login-card">
          <div class="card-header">
            <h2 class="login-title">欢迎回来</h2>
            <p class="login-subtitle">登录您的管理账户</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label class="form-label">
                <UserIcon class="h-4 w-4" />
                账号
              </label>
              <div class="input-wrapper" :class="{ 'input-focused': usernameFocused, 'input-error': usernameError }">
                <input 
                  v-model="username" 
                  type="text"
                  placeholder="请输入您的账号"
                  class="form-input"
                  @focus="usernameFocused = true; usernameError = false"
                  @blur="usernameFocused = false"
                  :disabled="loading"
                />
                <UserIcon class="h-4 w-4 input-icon" />
              </div>
              <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <LockClosedIcon class="h-4 w-4" />
                密码
              </label>
              <div class="input-wrapper password-wrapper" :class="{ 'input-focused': passwordFocused, 'input-error': passwordError }">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入您的密码"
                  class="form-input password-input"
                  @focus="passwordFocused = true; passwordError = false"
                  @blur="passwordFocused = false"
                  :disabled="loading"
                />
                <LockClosedIcon class="h-4 w-4 password-icon" />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                  :disabled="loading">
                  <EyeSlashIcon v-if="showPassword" class="h-4 w-4" />
                  <EyeIcon v-else class="h-4 w-4" />
                </button>
              </div>
              <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe" :disabled="loading">
                <span class="checkmark"></span>
                <span class="checkbox-label">记住我</span>
              </label>
              <a href="#" class="forgot-link">忘记密码？</a>
            </div>

            <button 
              type="submit" 
              class="login-button"
              :disabled="loading || !isFormValid"
              :class="{ 'button-loading': loading }">
              <span v-if="!loading" class="button-content">
                <ArrowRightOnRectangleIcon class="h-4 w-4" />
                立即登录
              </span>
              <span v-else class="button-content">
                <ArrowPathIcon class="h-4 w-4 animate-spin" />
                登录中...
              </span>
            </button>

            <div class="divider">
              <span>或</span>
            </div>

            <div class="register-section">
              <p class="register-text">还没有账号？</p>
              <router-link to="/register" class="register-link">
                <UserPlusIcon class="h-4 w-4" />
                立即注册
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast 通知 -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <component :is="toast.iconComponent" class="h-5 w-5" />
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  BeakerIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  ChartBarIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon,
  UserPlusIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { authAPI } from '@/api/trace'
import { storage } from '@/utils'

const router = useRouter()

// 表单数据
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false) // 添加这个缺失的响应式变量
const loading = ref(false)

// 焦点状态
const usernameFocused = ref(false)
const passwordFocused = ref(false)

// 错误状态
const usernameError = ref('')
const passwordError = ref('')

// Toast 通知
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  iconComponent: CheckCircleIcon
})

// 表单验证
const isFormValid = computed(() => {
  return username.value.trim() && password.value.trim()
})

// 显示 Toast
function showToast(message, type = 'success') {
  const icons = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon
  }
  
  toast.value = {
    show: true,
    message,
    type,
    iconComponent: icons[type]
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// 表单验证
function validateForm() {
  let isValid = true
  
  if (!username.value.trim()) {
    usernameError.value = '请输入账号'
    isValid = false
  }
  
  if (!password.value.trim()) {
    passwordError.value = '请输入密码'
    isValid = false
  }
  
  return isValid
}

// 登录处理
async function handleLogin() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const response = await authAPI.login({
      username: username.value,
      password: password.value
    })
    
    // 保存token和登录状态
    storage.set('token', response.token)
    storage.set('isAdminLogin', 'true')
    storage.set('userInfo', response.user)
    
    // 如果选择记住我，保存用户名
    if (rememberMe.value) {
      storage.set('rememberedUsername', username.value)
    } else {
      storage.remove('rememberedUsername')
    }
    
    showToast('登录成功！', 'success')
    
    setTimeout(() => {
      router.push('/trace/admin/home')
    }, 1000)
    
  } catch (error) {
    showToast(error.message || '登录失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 主要内容区域 */
.login-content {
  display: flex;
  max-width: 1200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

/* 左侧信息区域 */
.info-section {
  flex: 1;
  background: linear-gradient(135deg, #43a047 0%, #8bc34a 100%);
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
}

.brand-info {
  text-align: center;
  max-width: 400px;
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.brand-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.feature-list {
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.feature-item i {
  width: 24px;
  margin-right: 15px;
  opacity: 0.9;
}

/* 右侧表单区域 */
.form-section {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.label-icon {
  margin-right: 8px;
  color: #43a047;
}

.input-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 16px 50px 16px 16px; /* 账号输入框保持原有padding */
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  background: white;
}

.input-wrapper.input-focused {
  transform: translateY(-2px);
}

.input-wrapper.input-focused .form-input {
  border-color: #43a047;
  box-shadow: 0 4px 12px rgba(67, 160, 71, 0.15);
}

.input-wrapper.input-error .form-input {
  border-color: #f44336;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.15);
}

/* 密码输入框专用样式 */
.password-input {
  padding: 16px 80px 16px 16px; /* 密码输入框增加右侧padding */
}

.input-icon {
  position: absolute;
  right: 16px; /* 账号图标位置 */
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

/* 密码输入框图标 */
.password-icon {
  position: absolute;
  right: 50px; /* 密码锁图标位置 */
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: 16px; /* 密码切换按钮位置 */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #43a047;
}

.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 6px;
  display: block;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-wrapper input:checked + .checkmark {
  background: #43a047;
  border-color: #43a047;
}

.checkbox-wrapper input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #666;
}

.forgot-link {
  color: #43a047;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #388e3c;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #43a047 0%, #8bc34a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 160, 71, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 分割线 */
.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
  color: #999;
  font-size: 0.9rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 16px;
  position: relative;
  z-index: 2;
}

/* 注册区域 */
.register-section {
  text-align: center;
  margin-bottom: 32px;
}

.register-text {
  color: #666;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.register-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #43a047;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid #43a047;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.register-link:hover {
  background: #43a047;
  color: white;
  transform: translateY(-1px);
}

/* 演示信息 */
.demo-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #43a047;
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #43a047;
  margin-bottom: 12px;
}

.demo-account {
  font-size: 0.9rem;
  color: #666;
}

.demo-label {
  font-weight: 600;
}

code {
  background: #e8f5e8;
  color: #43a047;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

/* Toast 通知 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  min-width: 300px;
}

.toast.success {
  background: #43a047;
}

.toast.error {
  background: #f44336;
}

.toast.warning {
  background: #ff9800;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    margin: 10px;
  }
  
  .info-section {
    padding: 40px 20px;
  }
  
  .form-section {
    padding: 40px 20px;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .info-section,
  .form-section {
    padding: 30px 15px;
  }
}
</style> 











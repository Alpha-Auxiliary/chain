<template>
  <div class="register-container">
    <div class="register-card">
      <!-- 头部 -->
      <div class="register-header">
        <div class="logo-section">
          <div class="logo-icon">
            <BeakerIcon class="h-8 w-8 text-white" />
          </div>
          <div class="logo-text">
            <h1 class="app-name">溯农云链</h1>
            <p class="app-desc">用户注册</p>
          </div>
        </div>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister" class="register-form">
        <!-- 账号输入 -->
        <div class="form-group">
          <label class="form-label">
            <UserIcon class="h-4 w-4" />
            账号
          </label>
          <div class="input-wrapper" :class="{ 'input-focused': usernameFocused, 'input-error': usernameError }">
            <input 
              v-model="username" 
              type="text"
              placeholder="请输入账号"
              class="form-input"
              @focus="usernameFocused = true; usernameError = ''"
              @blur="usernameFocused = false"
              :disabled="loading"
            />
            <UserIcon class="h-4 w-4 input-icon" />
          </div>
          <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
        </div>

        <!-- 密码输入 -->
        <div class="form-group">
          <label class="form-label">
            <LockClosedIcon class="h-4 w-4" />
            密码
          </label>
          <div class="input-wrapper password-wrapper" :class="{ 'input-focused': passwordFocused, 'input-error': passwordError }">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              class="form-input password-input"
              @focus="passwordFocused = true; passwordError = ''"
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

        <!-- 确认密码 -->
        <div class="form-group">
          <label class="form-label">
            <LockClosedIcon class="h-4 w-4" />
            确认密码
          </label>
          <div class="input-wrapper password-wrapper" :class="{ 'input-focused': confirmPasswordFocused, 'input-error': confirmPasswordError }">
            <input 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              class="form-input password-input"
              @focus="confirmPasswordFocused = true; confirmPasswordError = ''"
              @blur="confirmPasswordFocused = false"
              :disabled="loading"
            />
            <LockClosedIcon class="h-4 w-4 password-icon" />
            <button 
              type="button" 
              @click="showConfirmPassword = !showConfirmPassword"
              class="password-toggle"
              :disabled="loading">
              <EyeSlashIcon v-if="showConfirmPassword" class="h-4 w-4" />
              <EyeIcon v-else class="h-4 w-4" />
            </button>
          </div>
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
        </div>

        <!-- 身份选择 -->
        <div class="form-group">
          <label class="form-label">
            <UserGroupIcon class="h-4 w-4" />
            身份
          </label>
          <div class="input-wrapper" :class="{ 'input-focused': roleFocused }">
            <select 
              v-model="role" 
              class="form-input"
              @focus="roleFocused = true"
              @blur="roleFocused = false"
              :disabled="loading"
            >
              <option value="farmer">农户</option>
              <option value="admin">管理员</option>
            </select>
            <UserGroupIcon class="h-4 w-4 input-icon" />
          </div>
        </div>

        <!-- 注册按钮 -->
        <button 
          type="submit" 
          class="register-btn"
          :disabled="loading || !isFormValid"
        >
          <ArrowPathIcon v-if="loading" class="h-5 w-5 animate-spin" />
          <UserPlusIcon v-else class="h-5 w-5" />
          {{ loading ? '注册中...' : '立即注册' }}
        </button>

        <!-- 登录链接 -->
        <div class="login-section">
          <p class="login-text">已有账号？</p>
          <router-link to="/login" class="login-link">
            <ArrowRightOnRectangleIcon class="h-4 w-4" />
            立即登录
          </router-link>
        </div>
      </form>
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
  UserIcon,
  LockClosedIcon,
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { authAPI } from '@/api/trace'

const router = useRouter()

// 表单数据
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('farmer')
const loading = ref(false)

// 密码显示状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 焦点状态
const usernameFocused = ref(false)
const passwordFocused = ref(false)
const confirmPasswordFocused = ref(false)
const roleFocused = ref(false)

// 错误状态
const usernameError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// Toast 通知
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  iconComponent: CheckCircleIcon
})

// 表单验证
const isFormValid = computed(() => {
  return username.value.trim() && 
         password.value.trim() && 
         confirmPassword.value.trim() &&
         !usernameError.value &&
         !passwordError.value &&
         !confirmPasswordError.value
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
  
  // 验证账号
  if (!username.value.trim()) {
    usernameError.value = '请输入账号'
    isValid = false
  } else if (username.value.length < 3) {
    usernameError.value = '账号至少3个字符'
    isValid = false
  }
  
  // 验证密码
  if (!password.value.trim()) {
    passwordError.value = '请输入密码'
    isValid = false
  } else if (password.value.length < 6) {
    passwordError.value = '密码至少6个字符'
    isValid = false
  }
  
  // 验证确认密码
  if (!confirmPassword.value.trim()) {
    confirmPasswordError.value = '请确认密码'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = '两次密码不一致'
    isValid = false
  }
  
  return isValid
}

// 注册处理
async function handleRegister() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const registerData = {
      username: username.value.trim(),
      password: password.value.trim(),
      name: username.value.trim(), // 使用用户名作为姓名
      role: role.value || 'farmer'
    }
    
    console.log('发送注册数据:', registerData)
    
    const response = await authAPI.register(registerData)
    
    showToast('注册成功！即将跳转到登录页面', 'success')
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    console.error('注册错误:', error)
    showToast(error.message || '注册失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 480px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.logo-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.app-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.app-desc {
  color: #6b7280;
  font-size: 1rem;
  margin: 4px 0 0 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 16px 50px 16px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.password-input {
  padding: 16px 80px 16px 16px;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-focused .form-input {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-error .form-input {
  border-color: #ef4444;
  background: #fef2f2;
}

.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.password-icon {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
}

.register-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.register-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.login-text {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.login-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.login-link:hover {
  color: #1d4ed8;
  transform: translateX(2px);
}

/* Toast 样式 */
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 300px;
}

.toast.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.toast.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
@media (max-width: 640px) {
  .register-container {
    padding: 16px;
  }
  
  .register-card {
    padding: 32px 24px;
  }
  
  .logo-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .app-name {
    font-size: 1.75rem;
  }
}
</style> 

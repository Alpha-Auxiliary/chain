<template>
  <header class="topbar-bg flex items-center justify-between px-6 h-16 border-b border-green-100/50 backdrop-blur-sm">
    <!-- 面包屑导航 -->
    <nav class="flex items-center gap-2">
      <RouterLink to="/trace/admin/home">
        <HomeIcon class="h-4 w-4 text-green-600" />
      </RouterLink>
      <ChevronRightIcon class="h-3 w-3 text-green-400" />
      <span class="text-sm text-green-700 font-medium">{{ currentPageName }}</span>
    </nav>

    <!-- 右侧功能区域 -->
    <div class="flex items-center gap-4">
      <!-- 通知按钮 -->
      <button 
        class="relative p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
        @click="showNotifications = !showNotifications"
      >
        <BellIcon class="h-5 w-5" />
        <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- 设置按钮 -->
      <button 
        class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
        @click="showSettings = !showSettings"
      >
        <Cog6ToothIcon class="h-5 w-5" />
      </button>

      <!-- 用户菜单 -->
      <div class="relative">
        <div 
          class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer select-none transition-all duration-200 hover:bg-green-50/80 group"
          @click="toggleMenu"
        >
          <div class="relative">
            <div class="h-8 w-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <UserIcon class="h-4 w-4 text-white" />
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div class="hidden sm:block">
            <div class="font-semibold text-green-700 text-sm">{{ username }}</div>
            <div class="text-xs text-green-600/70">{{ userRole }}</div>
          </div>
          <ChevronDownIcon 
            class="h-4 w-4 text-green-600 transition-transform duration-200 group-hover:text-green-700"
            :class="{ 'rotate-180': showMenu }"
          />
        </div>

        <!-- 用户下拉菜单 -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95 translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-1"
        >
          <div
            v-show="showMenu"
            class="user-menu absolute right-0 top-14 bg-white border border-green-100 rounded-2xl shadow-xl py-3 min-w-[200px] z-50"
            @click.stop
          >
            <!-- 用户信息 -->
            <div class="px-4 py-3 border-b border-green-50">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <UserIcon class="h-5 w-5 text-white" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ username }}</div>
                  <div class="text-sm text-gray-500">{{ userRole }}</div>
                </div>
              </div>
            </div>

            <!-- 菜单项 -->
            <div class="py-2">
              <button 
                class="menu-item w-full px-4 py-2 text-left flex items-center gap-3 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                @click="viewProfile"
              >
                <UserCircleIcon class="h-4 w-4" />
                <span>个人资料</span>
              </button>
              
              <button 
                class="menu-item w-full px-4 py-2 text-left flex items-center gap-3 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                @click="changePassword"
              >
                <KeyIcon class="h-4 w-4" />
                <span>修改密码</span>
              </button>
              
              <button 
                class="menu-item w-full px-4 py-2 text-left flex items-center gap-3 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                @click="viewHelp"
              >
                <QuestionMarkCircleIcon class="h-4 w-4" />
                <span>帮助中心</span>
              </button>
            </div>

            <!-- 分割线 -->
            <div class="border-t border-green-50 my-2"></div>

            <!-- 退出登录 -->
            <button 
              class="menu-item w-full px-4 py-2 text-left flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              @click="logout"
            >
              <ArrowRightOnRectangleIcon class="h-4 w-4" />
              <span>退出登录</span>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- 点击外部关闭菜单 -->
    <div 
      v-if="showMenu" 
      class="fixed inset-0 z-40" 
      @click="showMenu = false"
    ></div>
  </header>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  ChevronRightIcon,
  KeyIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// 响应式数据
const username = ref('管理员')
const userRole = ref('系统管理员')
const showMenu = ref(false)
const showNotifications = ref(false)
const showSettings = ref(false)

// 计算当前页面名称
const currentPageName = computed(() => {
  const routeNames = {
    '/trace/admin': '控制台',
    '/trace/admin/category': '分类管理',
    '/trace/admin/audit': '数据审核',
    '/trace/admin/statistics': '统计分析',
    '/trace/farmer/add': '数据录入',
    '/trace/farmer/manage': '数据管理',
    '/trace/query': '扫码查询',
    '/trace/result': '溯源结果',
    '/trace/admin/category/add': '添加分类',
    '/trace/admin/code/add':'生成码',
    '/trace/admin/code':'码管理',
    '/trace/admin/trace':'流程管理'
  }
  return routeNames[route.path] || '管理平台'
})

// 方法
function toggleMenu() {
  showMenu.value = !showMenu.value
  showNotifications.value = false
  showSettings.value = false
}

function viewProfile() {
  showMenu.value = false
  // TODO: 跳转到个人资料页面
  console.log('查看个人资料')
}

function changePassword() {
  showMenu.value = false
  // TODO: 打开修改密码对话框
  console.log('修改密码')
}

function viewHelp() {
  showMenu.value = false
  // TODO: 跳转到帮助页面
  console.log('查看帮助')
}

function logout() {
  showMenu.value = false
  localStorage.removeItem('isAdminLogin')
  router.replace('/login').then(() => window.location.reload())
}

// 键盘事件处理
function handleKeydown(event) {
  if (event.key === 'Escape') {
    showMenu.value = false
    showNotifications.value = false
    showSettings.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
<style scoped>
.topbar-bg {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.user-menu {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(34, 197, 94, 0.1);
}

.menu-item {
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.1), transparent);
  transition: width 0.3s ease;
}

.menu-item:hover::before {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .topbar-bg {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 



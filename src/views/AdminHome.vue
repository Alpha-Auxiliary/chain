<template>
  <div class="space-y-6">
    <!-- 欢迎横幅 -->
    <div class="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">欢迎回来，{{ username }}！</h1>
          <p class="text-green-100 text-lg">今天是 {{ currentDate }}，{{ greeting }}</p>
          <p class="text-green-100 mt-1">{{ systemStatus }}</p>
        </div>
        <div class="hidden md:block">
          <div class="bg-white bg-opacity-20 rounded-full p-4">
            <HomeIcon class="h-12 w-12 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- 快速统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">今日查询</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatNumber(todayStats.queries) }}</p>
            <div class="flex items-center mt-2 text-sm">
              <ArrowUpIcon class="h-4 w-4 text-green-500 mr-1" />
              <span class="text-green-600">+{{ todayStats.queryGrowth }}%</span>
            </div>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <MagnifyingGlassIcon class="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">新增产品</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatNumber(todayStats.newProducts) }}</p>
            <div class="flex items-center mt-2 text-sm">
              <ArrowUpIcon class="h-4 w-4 text-green-500 mr-1" />
              <span class="text-green-600">+{{ todayStats.productGrowth }}%</span>
            </div>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <ArchiveBoxIcon class="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">活跃农户</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatNumber(todayStats.activeFarmers) }}</p>
            <div class="flex items-center mt-2 text-sm">
              <ArrowUpIcon class="h-4 w-4 text-green-500 mr-1" />
              <span class="text-green-600">+{{ todayStats.farmerGrowth }}%</span>
            </div>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <UsersIcon class="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">待审核</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatNumber(todayStats.pendingAudits) }}</p>
            <div class="flex items-center mt-2 text-sm">
              <ClockIcon class="h-4 w-4 text-orange-500 mr-1" />
              <span class="text-orange-600">需要处理</span>
            </div>
          </div>
          <div class="p-3 bg-orange-100 rounded-full">
            <ExclamationTriangleIcon class="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- 主要功能区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 快速操作 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BoltIcon class="h-5 w-5 text-yellow-500 mr-2" />
          快速操作
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <router-link
            to="/trace/admin/category/add"
            class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
          >
            <PlusCircleIcon class="h-8 w-8 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <p class="font-medium text-gray-900">添加分类</p>
              <p class="text-sm text-gray-500">新建产品分类</p>
            </div>
          </router-link>

          <router-link
            to="/trace/admin/code/add"
            class="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300 group"
          >
            <QrCodeIcon class="h-8 w-8 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <p class="font-medium text-gray-900">生成码</p>
              <p class="text-sm text-gray-500">批量生成溯源码</p>
            </div>
          </router-link>

          <router-link
            to="/trace/admin/audit"
            class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group"
          >
            <CheckCircleIcon class="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <p class="font-medium text-gray-900">数据审核</p>
              <p class="text-sm text-gray-500">审核溯源数据</p>
            </div>
          </router-link>

          <router-link
            to="/trace/admin/statistics"
            class="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300 group"
          >
            <ChartBarIcon class="h-8 w-8 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
            <div>
              <p class="font-medium text-gray-900">统计分析</p>
              <p class="text-sm text-gray-500">查看数据报表</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CpuChipIcon class="h-5 w-5 text-green-500 mr-2" />
          系统状态
        </h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span class="text-gray-700">数据库连接</span>
            </div>
            <span class="text-green-600 font-medium">正常</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span class="text-gray-700">区块链网络</span>
            </div>
            <span class="text-green-600 font-medium">已连接</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <span class="text-gray-700">API 服务</span>
            </div>
            <span class="text-yellow-600 font-medium">{{ apiStatus }}</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span class="text-gray-700">缓存服务</span>
            </div>
            <span class="text-blue-600 font-medium">运行中</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动和通知 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近活动 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <ClockIcon class="h-5 w-5 text-blue-500 mr-2" />
            最近活动
          </h3>
          <router-link to="/trace/admin/audit" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            查看全部
          </router-link>
        </div>
        <div class="space-y-3">
          <div v-for="activity in recentActivities" :key="activity.id" 
               class="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="flex-shrink-0 mr-3">
              <component :is="activity.icon" class="h-5 w-5 text-gray-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统通知 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <BellIcon class="h-5 w-5 text-yellow-500 mr-2" />
            系统通知
          </h3>
          <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            标记已读
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="notification in notifications" :key="notification.id"
               class="flex items-start p-3 rounded-lg border-l-4"
               :class="notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 
                       notification.type === 'error' ? 'bg-red-50 border-red-400' : 
                       'bg-blue-50 border-blue-400'">
            <div class="flex-1">
              <p class="text-sm font-medium" 
                 :class="notification.type === 'warning' ? 'text-yellow-800' : 
                         notification.type === 'error' ? 'text-red-800' : 
                         'text-blue-800'">
                {{ notification.title }}
              </p>
              <p class="text-xs mt-1"
                 :class="notification.type === 'warning' ? 'text-yellow-600' : 
                         notification.type === 'error' ? 'text-red-600' : 
                         'text-blue-600'">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速链接 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <LinkIcon class="h-5 w-5 text-purple-500 mr-2" />
        常用功能
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <router-link
          v-for="link in quickLinks"
          :key="link.path"
          :to="link.path"
          class="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div class="p-3 rounded-full mb-2 group-hover:scale-110 transition-transform"
               :class="link.bgColor">
            <component :is="link.icon" class="h-6 w-6" :class="link.iconColor" />
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">{{ link.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowUpIcon,
  BoltIcon,
  PlusCircleIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CpuChipIcon,
  BellIcon,
  LinkIcon,
  TagIcon,
  CircleStackIcon,
  Bars3BottomLeftIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { statisticsAPI } from '@/api/trace'
import { storage } from '@/utils'

// 响应式数据
const username = ref('管理员')
const currentDate = ref('')
const greeting = ref('')
const systemStatus = ref('系统运行正常')
const apiStatus = ref('正常')

const todayStats = ref({
  queries: 0,
  queryGrowth: 15.2,
  newProducts: 0,
  productGrowth: 8.5,
  activeFarmers: 0,
  farmerGrowth: 12.3,
  pendingAudits: 8
})

const recentActivities = ref([
  {
    id: 1,
    description: '用户查询了产品 "有机大米" 的溯源信息',
    time: '2分钟前',
    icon: MagnifyingGlassIcon
  },
  {
    id: 2,
    description: '农户张三提交了新的生产数据',
    time: '5分钟前',
    icon: PlusCircleIcon
  },
  {
    id: 3,
    description: '管理员审核通过了3条溯源记录',
    time: '10分钟前',
    icon: CheckCircleIcon
  },
  {
    id: 4,
    description: '系统自动生成了100个新的溯源码',
    time: '15分钟前',
    icon: QrCodeIcon
  }
])

const notifications = ref([
  {
    id: 1,
    type: 'warning',
    title: '待审核数据较多',
    message: '当前有8条数据等待审核，请及时处理',
    time: '1小时前'
  },
  {
    id: 2,
    type: 'info',
    title: '系统更新通知',
    message: '系统将在今晚23:00进行例行维护',
    time: '2小时前'
  },
  {
    id: 3,
    type: 'error',
    title: '区块链网络延迟',
    message: '检测到区块链网络响应较慢，请关注',
    time: '3小时前'
  }
])

const quickLinks = ref([
  {
    path: '/trace/admin/category',
    label: '分类管理',
    icon: TagIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    path: '/trace/admin/code',
    label: '码管理',
    icon: QrCodeIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    path: '/trace/admin/trace',
    label: '流程管理',
    icon: Bars3BottomLeftIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    path: '/trace/farmer/manage',
    label: '数据管理',
    icon: CircleStackIcon,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    path: '/trace/admin/audit',
    label: '数据审核',
    icon: ShieldCheckIcon,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    path: '/trace/query',
    label: '扫码查询',
    icon: MagnifyingGlassIcon,
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  }
])

// 计算属性
const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}

// 生命周期
onMounted(() => {
  updateDateTime()
  // 每分钟更新一次时间
  setInterval(updateDateTime, 60000)
  
  // 加载数据
  loadDashboardData()
})

// 方法
function updateDateTime() {
  const now = new Date()
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  }
  currentDate.value = now.toLocaleDateString('zh-CN', options)
  
  const hour = now.getHours()
  if (hour < 6) {
    greeting.value = '夜深了，注意休息'
  } else if (hour < 12) {
    greeting.value = '早上好'
  } else if (hour < 18) {
    greeting.value = '下午好'
  } else {
    greeting.value = '晚上好'
  }
}

async function loadDashboardData() {
  try {
    // 检查是否已登录
    const token = storage.get('token')
    if (!token) {
      console.log('未登录，跳转到登录页')
      window.location.href = '/login'
      return
    }

    const response = await statisticsAPI.getStatistics()
    const data = response.data
    
    // 更新统计数据
    todayStats.value = {
      queries: data.totalQueries,
      queryGrowth: 15.2,
      newProducts: data.totalProducts,
      productGrowth: 8.5,
      activeFarmers: data.activeFarmers,
      farmerGrowth: 12.3,
      pendingAudits: 5
    }
    
    // 检查API状态
    apiStatus.value = '正常'
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
    
    // 如果是401错误，跳转到登录页
    if (error.status === 401) {
      storage.remove('token')
      storage.remove('isAdminLogin')
      window.location.href = '/login'
      return
    }
    
    apiStatus.value = '异常'
    
    // 使用默认值
    todayStats.value = {
      queries: 0,
      queryGrowth: 0,
      newProducts: 0,
      productGrowth: 0,
      activeFarmers: 0,
      farmerGrowth: 0,
      pendingAudits: 0
    }
  }
}
</script> 




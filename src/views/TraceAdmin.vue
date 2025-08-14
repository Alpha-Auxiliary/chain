<template>
  <div class="space-y-6">
    <!-- 页面标题和概览 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <ShieldCheckIcon class="h-8 w-8 text-blue-600 mr-3" />
            监管后台管理
          </h1>
          <p class="text-gray-500 mt-1">监管溯源数据、审核记录和系统统计</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="refreshData"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
          >
            <ArrowPathIcon class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
            刷新数据
          </button>
          <button
            @click="exportReport"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
            导出报告
          </button>
        </div>
      </div>

      <!-- 监管概览统计 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">待审核数据</p>
              <p class="text-2xl font-bold text-blue-900">{{ overviewStats.pendingAudits }}</p>
              <p class="text-xs text-blue-600 mt-1">
                <span class="inline-flex items-center">
                  <ExclamationTriangleIcon class="h-3 w-3 mr-1" />
                  需要处理
                </span>
              </p>
            </div>
            <ClockIcon class="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">已审核通过</p>
              <p class="text-2xl font-bold text-green-900">{{ overviewStats.approvedRecords }}</p>
              <p class="text-xs text-green-600 mt-1">
                <span class="inline-flex items-center">
                  <CheckCircleIcon class="h-3 w-3 mr-1" />
                  本月 +{{ overviewStats.monthlyApproved }}
                </span>
              </p>
            </div>
            <CheckCircleIcon class="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div class="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-600 text-sm font-medium">异常记录</p>
              <p class="text-2xl font-bold text-red-900">{{ overviewStats.rejectedRecords }}</p>
              <p class="text-xs text-red-600 mt-1">
                <span class="inline-flex items-center">
                  <XCircleIcon class="h-3 w-3 mr-1" />
                  需要关注
                </span>
              </p>
            </div>
            <XCircleIcon class="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">监管覆盖率</p>
              <p class="text-2xl font-bold text-purple-900">{{ overviewStats.coverageRate }}%</p>
              <p class="text-xs text-purple-600 mt-1">
                <span class="inline-flex items-center">
                  <ChartBarIcon class="h-3 w-3 mr-1" />
                  较上月 +2.3%
                </span>
              </p>
            </div>
            <ShieldCheckIcon class="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- 主要功能区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 审核列表 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <ClipboardDocumentCheckIcon class="h-5 w-5 text-blue-500 mr-2" />
            待审核列表
          </h3>
          <router-link 
            to="/trace/admin/audit" 
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            查看全部
          </router-link>
        </div>
        <AuditList :limit="5" @audit-completed="handleAuditCompleted" />
      </div>

      <!-- 统计图表 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <ChartBarIcon class="h-5 w-5 text-green-500 mr-2" />
            监管统计
          </h3>
          <router-link 
            to="/trace/admin/statistics" 
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            详细报表
          </router-link>
        </div>
        <StatisticCharts :data="chartData" />
      </div>
    </div>

    <!-- 最近监管活动 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <ClockIcon class="h-5 w-5 text-orange-500 mr-2" />
          最近监管活动
        </h3>
        <div class="flex items-center space-x-2">
          <select 
            v-model="activityFilter" 
            @change="loadRecentActivities"
            class="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">全部活动</option>
            <option value="audit">审核活动</option>
            <option value="alert">异常警报</option>
            <option value="system">系统活动</option>
          </select>
        </div>
      </div>
      
      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex-shrink-0 mr-3">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="getActivityIconClass(activity.type)"
            >
              <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ activity.description }}</p>
            <div class="flex items-center mt-2 space-x-4">
              <span class="text-xs text-gray-400">{{ activity.time }}</span>
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getActivityStatusClass(activity.status)"
              >
                {{ activity.status }}
              </span>
              <span class="text-xs text-gray-400">操作人: {{ activity.operator }}</span>
            </div>
          </div>
          <div class="flex-shrink-0">
            <button 
              @click="viewActivityDetail(activity)"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作面板 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BoltIcon class="h-5 w-5 text-yellow-500 mr-2" />
        快速操作
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          @click="batchAudit"
          class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
        >
          <ClipboardDocumentCheckIcon class="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-gray-900">批量审核</span>
          <span class="text-xs text-gray-500">快速处理</span>
        </button>

        <button
          @click="generateReport"
          class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
        >
          <DocumentTextIcon class="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-gray-900">生成报告</span>
          <span class="text-xs text-gray-500">监管报告</span>
        </button>

        <button
          @click="systemCheck"
          class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
        >
          <CpuChipIcon class="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-gray-900">系统检查</span>
          <span class="text-xs text-gray-500">健康检查</span>
        </button>

        <button
          @click="alertManagement"
          class="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
        >
          <BellIcon class="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-gray-900">警报管理</span>
          <span class="text-xs text-gray-500">异常处理</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  BoltIcon,
  DocumentTextIcon,
  CpuChipIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import AuditList from '../components/AuditList.vue'
import StatisticCharts from '../components/StatisticCharts.vue'
import { statisticsAPI } from '@/api/trace'

// 响应式数据
const loading = ref(false)
const activityFilter = ref('all')

const overviewStats = ref({
  pendingAudits: 8,
  approvedRecords: 156,
  rejectedRecords: 12,
  coverageRate: 87.5,
  monthlyApproved: 23
})

const chartData = ref({
  auditTrend: [],
  categoryDistribution: [],
  riskLevel: []
})

const recentActivities = ref([
  {
    id: 1,
    type: 'audit',
    title: '批量审核完成',
    description: '管理员审核通过了15条溯源记录',
    time: '5分钟前',
    status: '已完成',
    operator: '张管理员'
  },
  {
    id: 2,
    type: 'alert',
    title: '异常数据检测',
    description: '检测到农户李四提交的数据存在异常',
    time: '10分钟前',
    status: '待处理',
    operator: '系统自动'
  },
  {
    id: 3,
    type: 'system',
    title: '系统备份完成',
    description: '每日数据备份已成功完成',
    time: '1小时前',
    status: '已完成',
    operator: '系统自动'
  },
  {
    id: 4,
    type: 'audit',
    title: '质量检测报告审核',
    description: '审核了3份质量检测报告',
    time: '2小时前',
    status: '已完成',
    operator: '王审核员'
  }
])

// 计算属性
const filteredActivities = computed(() => {
  if (activityFilter.value === 'all') {
    return recentActivities.value
  }
  return recentActivities.value.filter(activity => activity.type === activityFilter.value)
})

// 方法
function getActivityIcon(type) {
  const icons = {
    audit: ClipboardDocumentCheckIcon,
    alert: ExclamationTriangleIcon,
    system: CpuChipIcon
  }
  return icons[type] || ClockIcon
}

function getActivityIconClass(type) {
  const classes = {
    audit: 'bg-blue-100 text-blue-600',
    alert: 'bg-red-100 text-red-600',
    system: 'bg-green-100 text-green-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

function getActivityStatusClass(status) {
  const classes = {
    '已完成': 'bg-green-100 text-green-800',
    '待处理': 'bg-yellow-100 text-yellow-800',
    '处理中': 'bg-blue-100 text-blue-800',
    '已取消': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

async function refreshData() {
  loading.value = true
  try {
    await Promise.all([
      loadOverviewStats(),
      loadChartData(),
      loadRecentActivities()
    ])
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    loading.value = false
  }
}

async function loadOverviewStats() {
  try {
    const response = await statisticsAPI.getStatistics()
    // 更新概览统计
    overviewStats.value = {
      pendingAudits: 8,
      approvedRecords: response.data.totalQueries || 156,
      rejectedRecords: 12,
      coverageRate: 87.5,
      monthlyApproved: 23
    }
  } catch (error) {
    console.error('加载概览统计失败:', error)
  }
}

async function loadChartData() {
  try {
    const response = await statisticsAPI.getStatistics()
    chartData.value = {
      auditTrend: response.data.queryTrend || [],
      categoryDistribution: response.data.categoryDistribution || [],
      riskLevel: [
        { level: '低风险', count: 120, color: '#10B981' },
        { level: '中风险', count: 25, color: '#F59E0B' },
        { level: '高风险', count: 8, color: '#EF4444' }
      ]
    }
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

function loadRecentActivities() {
  // 模拟加载最近活动
  console.log('加载最近活动，过滤条件:', activityFilter.value)
}

function handleAuditCompleted(result) {
  // 处理审核完成事件
  overviewStats.value.pendingAudits--
  if (result.status === 'approved') {
    overviewStats.value.approvedRecords++
  } else {
    overviewStats.value.rejectedRecords++
  }
  
  // 添加到活动记录
  recentActivities.value.unshift({
    id: Date.now(),
    type: 'audit',
    title: '数据审核完成',
    description: `${result.status === 'approved' ? '通过' : '拒绝'}了溯源记录 ${result.recordId}`,
    time: '刚刚',
    status: '已完成',
    operator: '当前用户'
  })
}

function viewActivityDetail(activity) {
  // 查看活动详情
  console.log('查看活动详情:', activity)
}

function exportReport() {
  // 导出监管报告
  console.log('导出监管报告')
}

function batchAudit() {
  // 批量审核
  console.log('批量审核')
}

function generateReport() {
  // 生成报告
  console.log('生成监管报告')
}

function systemCheck() {
  // 系统检查
  console.log('执行系统健康检查')
}

function alertManagement() {
  // 警报管理
  console.log('打开警报管理')
}

// 生命周期
onMounted(() => {
  refreshData()
})
</script>
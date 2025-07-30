<template>
  <div class="statistics-page p-6 space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">数据统计分析</h2>
        <p class="text-gray-600 mt-1">实时监控系统运行状态和数据趋势</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-500">
          最后更新: {{ lastUpdateTime }}
        </div>
        <div class="flex items-center gap-2">
          <!-- 自动刷新开关 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">自动刷新</label>
            <button
              @click="toggleAutoRefresh"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                autoRefreshEnabled ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <!-- 手动刷新按钮 -->
          <button 
            @click="refreshData"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50">
            <ArrowPathIcon 
              class="h-4 w-4 transition-transform duration-500" 
              :class="{ 
                'animate-spin': loading || isRefreshing,
                'text-blue-200': loading 
              }" 
            />
            {{ loading ? '刷新中...' : '刷新数据' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 刷新状态指示器 -->
    <transition name="fade">
      <div v-if="isRefreshing" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <ArrowPathIcon class="h-5 w-5 text-blue-600 animate-spin" />
          </div>
          <div class="flex-1">
            <p class="text-blue-800 font-medium">正在更新数据...</p>
            <div class="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${refreshProgress}%` }"
              ></div>
            </div>
          </div>
          <div class="text-blue-600 text-sm font-medium">
            {{ refreshProgress }}%
          </div>
        </div>
      </div>
    </transition>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">总产品数</p>
            <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.totalProducts) }}</p>
            <div class="flex items-center mt-2">
              <ArrowUpIcon v-if="stats.productGrowth > 0" class="h-4 w-4 text-green-300" />
              <ArrowDownIcon v-else class="h-4 w-4 text-red-300" />
              <span class="text-sm ml-1">{{ Math.abs(stats.productGrowth) }}%</span>
            </div>
          </div>
          <CubeIcon class="h-12 w-12 text-blue-200" />
        </div>
      </div>

      <div class="stat-card bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">溯源码总数</p>
            <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.totalCodes) }}</p>
            <div class="flex items-center mt-2">
              <ArrowUpIcon v-if="stats.codeGrowth > 0" class="h-4 w-4 text-green-300" />
              <ArrowDownIcon v-else class="h-4 w-4 text-red-300" />
              <span class="text-sm ml-1">{{ Math.abs(stats.codeGrowth) }}%</span>
            </div>
          </div>
          <QrCodeIcon class="h-12 w-12 text-green-200" />
        </div>
      </div>

      <div class="stat-card bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">查询次数</p>
            <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.totalQueries) }}</p>
            <div class="flex items-center mt-2">
              <ArrowUpIcon v-if="stats.queryGrowth > 0" class="h-4 w-4 text-green-300" />
              <ArrowDownIcon v-else class="h-4 w-4 text-red-300" />
              <span class="text-sm ml-1">{{ Math.abs(stats.queryGrowth) }}%</span>
            </div>
          </div>
          <MagnifyingGlassIcon class="h-12 w-12 text-purple-200" />
        </div>
      </div>

      <div class="stat-card bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">活跃农户</p>
            <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.activeFarmers) }}</p>
            <div class="flex items-center mt-2">
              <ArrowUpIcon v-if="stats.farmerGrowth > 0" class="h-4 w-4 text-green-300" />
              <ArrowDownIcon v-else class="h-4 w-4 text-red-300" />
              <span class="text-sm ml-1">{{ Math.abs(stats.farmerGrowth) }}%</span>
            </div>
          </div>
          <UsersIcon class="h-12 w-12 text-orange-200" />
        </div>
      </div>
    </div>

    <!-- 时间范围选择器和图表区域 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">数据趋势分析</h3>
        <div class="flex items-center gap-2">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-3 py-1 text-sm rounded-lg transition-colors',
              selectedPeriod === period.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]">
            {{ period.label }}
          </button>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseChart
          title="查询趋势"
          :options="queryTrendOptions"
          :loading="chartsLoading"
          height="320px"
          @refresh="loadQueryTrendData"
        />
        
        <BaseChart
          title="产品分类分布"
          :options="categoryDistributionOptions"
          :loading="chartsLoading"
          height="320px"
          @refresh="loadCategoryData"
        />
      </div>
    </div>

    <!-- 更多图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BaseChart
        title="地区分布"
        :options="regionDistributionOptions"
        :loading="chartsLoading"
        height="280px"
        @refresh="loadRegionData"
      />
      
      <BaseChart
        title="月度增长趋势"
        :options="monthlyGrowthOptions"
        :loading="chartsLoading"
        height="280px"
        @refresh="loadMonthlyData"
      />
      
      <BaseChart
        title="用户活跃度"
        :options="userActivityOptions"
        :loading="chartsLoading"
        height="280px"
        @refresh="loadUserActivityData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { 
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CubeIcon,
  QrCodeIcon,
  MagnifyingGlassIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import { statisticsAPI } from '@/api/trace'

// 响应式数据
const loading = ref(false)
const chartsLoading = ref(false)
const isRefreshing = ref(false)
const refreshProgress = ref(0)
const lastUpdateTime = ref('')
const selectedPeriod = ref('7d')
const autoRefreshEnabled = ref(true)
const autoRefreshInterval = ref(null)

// 自动刷新间隔时间（毫秒）
const AUTO_REFRESH_INTERVAL = 30000 // 30秒

const timePeriods = [
  { label: '7天', value: '7d' },
  { label: '30天', value: '30d' },
  { label: '90天', value: '90d' },
  { label: '1年', value: '1y' }
]

const stats = ref({
  totalProducts: 0,
  totalCodes: 0,
  totalQueries: 0,
  activeFarmers: 0,
  productGrowth: 0,
  codeGrowth: 0,
  queryGrowth: 0,
  farmerGrowth: 0
})

// 图表配置保持不变...
const queryTrendOptions = ref({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    textStyle: {
      color: '#374151'
    }
  },
  legend: {
    data: ['查询次数', '成功查询'],
    top: 10,
    textStyle: {
      color: '#6b7280'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  },
  series: [
    {
      name: '查询次数',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: {
        color: '#3b82f6',
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ]
        }
      }
    },
    {
      name: '成功查询',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: {
        color: '#10b981',
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ]
        }
      }
    }
  ]
})

// 其他图表配置保持不变...
const categoryDistributionOptions = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: '#6b7280'
    }
  },
  series: [
    {
      name: '产品分类',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
})

const regionDistributionOptions = ref({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '地区分布',
      type: 'pie',
      radius: '70%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      }
    }
  ]
})

const monthlyGrowthOptions = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'bar',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#1d4ed8' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
})

const userActivityOptions = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#8b5cf6',
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.05)' }
          ]
        }
      }
    }
  ]
})

// 自动刷新功能
function toggleAutoRefresh() {
  autoRefreshEnabled.value = !autoRefreshEnabled.value
  
  if (autoRefreshEnabled.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

function startAutoRefresh() {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
  }
  
  autoRefreshInterval.value = setInterval(() => {
    if (!loading.value && !isRefreshing.value) {
      refreshData(true) // 传入 true 表示自动刷新
    }
  }, AUTO_REFRESH_INTERVAL)
}

function stopAutoRefresh() {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
    autoRefreshInterval.value = null
  }
}

// 带进度的刷新函数
async function refreshData(isAuto = false) {
  if (loading.value || isRefreshing.value) return
  
  loading.value = true
  isRefreshing.value = true
  refreshProgress.value = 0
  
  try {
    const tasks = [
      loadStatistics,
      loadQueryTrendData,
      loadCategoryData,
      loadRegionData,
      loadMonthlyData,
      loadUserActivityData
    ]
    
    for (let i = 0; i < tasks.length; i++) {
      await tasks[i]()
      refreshProgress.value = Math.round(((i + 1) / tasks.length) * 100)
      
      // 添加小延迟让进度条更明显
      if (i < tasks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    lastUpdateTime.value = new Date().toLocaleString('zh-CN')
    
    if (!isAuto) {
      // 手动刷新时显示成功提示
      showRefreshSuccess()
    }
    
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    loading.value = false
    setTimeout(() => {
      isRefreshing.value = false
      refreshProgress.value = 0
    }, 500)
  }
}

function showRefreshSuccess() {
  // 可以添加成功提示
  console.log('数据刷新成功')
}

// 数据加载函数
async function loadStatistics() {
  try {
    const response = await statisticsAPI.getStatistics()
    const data = response.data
    
    stats.value = {
      totalProducts: data.totalProducts,
      totalCodes: data.totalCodes,
      totalQueries: data.totalQueries,
      activeFarmers: data.activeFarmers,
      productGrowth: '+12.5',
      codeGrowth: '+8.3',
      queryGrowth: '+15.2',
      farmerGrowth: '+6.7'
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 使用默认值
    stats.value = {
      totalProducts: 0,
      totalCodes: 0,
      totalQueries: 0,
      activeFarmers: 0,
      productGrowth: '0',
      codeGrowth: '0',
      queryGrowth: '0',
      farmerGrowth: '0'
    }
  }
}

async function loadQueryTrendData() {
  chartsLoading.value = true
  try {
    const response = await statisticsAPI.getStatistics()
    const trendData = response.data.queryTrend || []
    
    if (trendData.length > 0) {
      const dates = trendData.map(item => {
        const date = new Date(item.date)
        return `${date.getMonth() + 1}/${date.getDate()}`
      })
      const queryData = trendData.map(item => item.count)
      const successData = queryData.map(count => Math.floor(count * 0.9))
      
      queryTrendOptions.value.xAxis.data = dates
      queryTrendOptions.value.series[0].data = queryData
      queryTrendOptions.value.series[1].data = successData
    }
  } catch (error) {
    console.error('加载趋势数据失败:', error)
  } finally {
    chartsLoading.value = false
  }
}

async function loadCategoryData() {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const categories = [
    { value: 335, name: '蔬菜类', itemStyle: { color: '#10b981' } },
    { value: 310, name: '水果类', itemStyle: { color: '#3b82f6' } },
    { value: 234, name: '粮食类', itemStyle: { color: '#f59e0b' } },
    { value: 135, name: '肉类', itemStyle: { color: '#ef4444' } },
    { value: 148, name: '其他', itemStyle: { color: '#8b5cf6' } }
  ]
  
  categoryDistributionOptions.value.series[0].data = categories
}

async function loadRegionData() {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const regions = [
    { value: 40, name: '华东', itemStyle: { color: '#3b82f6' } },
    { value: 25, name: '华南', itemStyle: { color: '#10b981' } },
    { value: 20, name: '华北', itemStyle: { color: '#f59e0b' } },
    { value: 15, name: '其他', itemStyle: { color: '#8b5cf6' } }
  ]
  
  regionDistributionOptions.value.series[0].data = regions
}

async function loadMonthlyData() {
  await new Promise(resolve => setTimeout(resolve, 350))
  
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const data = months.map(() => Math.floor(Math.random() * 50) + 10)
  
  monthlyGrowthOptions.value.xAxis.data = months
  monthlyGrowthOptions.value.series[0].data = data
}

async function loadUserActivityData() {
  await new Promise(resolve => setTimeout(resolve, 250))
  
  const data = [120, 80, 150, 300, 250, 180].map(val => 
    val + Math.floor(Math.random() * 100) - 50
  )
  userActivityOptions.value.series[0].data = data
}

// 工具函数
function generateDateRange(period) {
  const dates = []
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }))
  }
  
  return dates
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 监听时间周期变化
watch(() => selectedPeriod.value, () => {
  loadQueryTrendData()
})

// 生命周期
onMounted(() => {
  // 页面加载时自动开始刷新
  refreshData()
  
  // 启动自动刷新
  if (autoRefreshEnabled.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  // 清理定时器
  stopAutoRefresh()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style> 

<template>
  <div class="trace-query-page p-6 space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="stat-card bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">今日查询</p>
            <p class="text-2xl font-bold">{{ stats.todayQueries }}</p>
          </div>
          <MagnifyingGlassIcon class="h-8 w-8 text-blue-200" />
        </div>
      </div>
      <div class="stat-card bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">成功查询</p>
            <p class="text-2xl font-bold">{{ stats.successQueries }}</p>
          </div>
          <CheckCircleIcon class="h-8 w-8 text-green-200" />
        </div>
      </div>
      <div class="stat-card bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">历史记录</p>
            <p class="text-2xl font-bold">{{ queryHistory.length }}</p>
          </div>
          <ClockIcon class="h-8 w-8 text-purple-200" />
        </div>
      </div>
      <div class="stat-card bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm">产品种类</p>
            <p class="text-2xl font-bold">{{ stats.productTypes }}</p>
          </div>
          <CubeIcon class="h-8 w-8 text-orange-200" />
        </div>
      </div>
    </div>
    
    <!-- 查询区域 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1 relative">
          <QrCodeIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            v-model="code" 
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-lg" 
            placeholder="请输入或扫描溯源码" 
            @keyup.enter="manualQuery" 
          />
        </div>
        <div class="flex gap-3">
          <button 
            @click="startScan" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <CameraIcon class="h-5 w-5" />
            扫码查询
          </button>
          <button 
            @click="manualQuery" 
            :disabled="loading || !code.trim()"
            class="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5">
            <MagnifyingGlassIcon v-if="!loading" class="h-5 w-5" />
            <ArrowPathIcon v-else class="h-5 w-5 animate-spin" />
            {{ loading ? '查询中...' : '立即查询' }}
          </button>
        </div>
      </div>
      
      <!-- 快捷查询 -->
      <div v-if="quickCodes.length > 0" class="mt-4 pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <BoltIcon class="h-4 w-4 text-yellow-500" />
          快捷查询
        </h4>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="quickCode in quickCodes" 
            :key="quickCode"
            @click="quickQuery(quickCode)"
            class="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 border border-gray-200 hover:border-green-300 rounded-full transition-all duration-200 hover:shadow-sm">
            {{ quickCode }}
          </button>
        </div>
      </div>
      
      <!-- 历史查询记录 -->
      <div v-if="queryHistory.length > 0" class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ClockIcon class="h-4 w-4 text-blue-500" />
            最近查询记录
          </h4>
          <button 
            @click="clearHistory"
            class="text-xs text-gray-500 hover:text-red-500 transition-colors">
            清空记录
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="item in queryHistory.slice(0, 8)" 
            :key="item.code"
            @click="quickQuery(item.code)"
            class="group px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-all duration-200 flex items-center gap-2">
            <span>{{ item.code }}</span>
            <span class="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {{ formatTime(item.time) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- 查询结果区域 -->
    <div v-if="result" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- 产品信息卡片 -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <CubeIcon class="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ result.name }}</h3>
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <span class="flex items-center gap-1">
                  <MapPinIcon class="h-4 w-4" />
                  {{ result.origin }}
                </span>
                <span class="flex items-center gap-1">
                  <CalendarIcon class="h-4 w-4" />
                  {{ result.date }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              <CheckCircleIcon class="h-4 w-4 mr-1" />
              溯源认证
            </div>
            <p class="text-sm text-gray-500 mt-2">溯源码：{{ result.code }}</p>
          </div>
        </div>
      </div>

      <!-- 溯源时间线 -->
      <div class="p-6">
        <h4 class="font-bold text-xl mb-6 flex items-center text-gray-900">
          <ClockIcon class="h-6 w-6 text-green-600 mr-3" />
          溯源流程
        </h4>
        <div class="relative">
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-blue-500"></div>
          <div class="space-y-8">
            <div 
              v-for="(step, idx) in result.trace" 
              :key="idx" 
              class="relative flex items-start group">
              <!-- 时间线节点 -->
              <div class="absolute left-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span class="text-white text-sm font-bold">{{ idx + 1 }}</span>
              </div>
              
              <!-- 内容卡片 -->
              <div class="ml-20 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 group-hover:shadow-md transition-all duration-200 hover:border-green-300">
                <div class="flex justify-between items-start mb-3">
                  <h5 class="font-semibold text-lg text-gray-900">{{ step.title }}</h5>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon class="h-4 w-4" />
                    <span>{{ step.time }}</span>
                  </div>
                </div>
                <p class="text-gray-700 mb-4 leading-relaxed">{{ step.desc }}</p>
                
                <!-- 详细信息 -->
                <div v-if="step.details" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="(detail, key) in step.details" 
                    :key="key"
                    class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 font-medium">{{ key }}</span>
                      <span class="text-sm text-gray-900 font-semibold">{{ detail }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="flex flex-wrap justify-center gap-3">
          <button 
            @click="printResult" 
            class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <PrinterIcon class="h-4 w-4" />
            打印报告
          </button>
          <button 
            @click="shareResult" 
            class="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <ShareIcon class="h-4 w-4" />
            分享结果
          </button>
          <button 
            @click="downloadReport" 
            class="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <ArrowDownTrayIcon class="h-4 w-4" />
            下载报告
          </button>
          <button 
            @click="resetQuery" 
            class="flex items-center gap-2 px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <ArrowPathIcon class="h-4 w-4" />
            重新查询
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <QrCodeIcon class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">开始溯源查询</h3>
      <p class="text-gray-500 mb-6">输入溯源码或扫描二维码，获取产品完整溯源信息</p>
      <div class="flex justify-center gap-3">
        <button 
          @click="startScan"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          扫码查询
        </button>
        <button 
          @click="showDemo"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          查看示例
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <ArrowPathIcon class="h-8 w-8 text-green-600 animate-spin" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">正在查询溯源信息...</h3>
      <p class="text-gray-500">请稍候，正在为您获取产品溯源数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  QrCodeIcon,
  CameraIcon,
  ClockIcon,
  CheckCircleIcon,
  CubeIcon,
  MapPinIcon,
  CalendarIcon,
  PrinterIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  BoltIcon
} from '@heroicons/vue/24/outline'
import { fetchTraceData, statisticsAPI } from '@/api/trace'

const code = ref('TEST-TRACE-0001')
const loading = ref(false)
const result = ref(null)
const queryHistory = ref([])

// 快捷查询码
const quickCodes = ref([
  'DEMO-001',
  'SAMPLE-002', 
  'TEST-003',
  'ORGANIC-004'
])

// 统计数据
const stats = ref({
  todayQueries: 156,
  successQueries: 142,
  productTypes: 8
})

const computedStats = computed(() => ({
  ...stats.value,
  historyCount: queryHistory.value.length
}))

onMounted(() => {
  loadQueryHistory()
  loadStats()
})

function loadQueryHistory() {
  const saved = localStorage.getItem('traceQueryHistory')
  if (saved) {
    queryHistory.value = JSON.parse(saved)
  }
}

function saveToHistory(code) {
  const item = { code, time: new Date().toISOString() }
  queryHistory.value = queryHistory.value.filter(h => h.code !== code)
  queryHistory.value.unshift(item)
  queryHistory.value = queryHistory.value.slice(0, 20)
  localStorage.setItem('traceQueryHistory', JSON.stringify(queryHistory.value))
}

function clearHistory() {
  if (confirm('确定要清空查询记录吗？')) {
    queryHistory.value = []
    localStorage.removeItem('traceQueryHistory')
  }
}

function startScan() {
  // 模拟扫码
  const scanCodes = ['SCAN-001', 'SCAN-002', 'SCAN-003']
  const randomCode = scanCodes[Math.floor(Math.random() * scanCodes.length)]
  code.value = randomCode + '-' + Date.now().toString().slice(-6)
  manualQuery()
}

async function manualQuery() {
  if (!code.value.trim()) {
    alert('请输入溯源码')
    return
  }
  
  loading.value = true
  
  try {
    saveToHistory(code.value)
    
    // 调用真实API
    const response = await fetchTraceData(code.value)
    
    result.value = {
      code: code.value,
      name: response.data.basic_info.product_name,
      origin: response.data.basic_info.company_address,
      date: response.data.basic_info.production_date,
      trace: response.data.steps.map(step => ({
        title: step.step_name,
        time: new Date(step.timestamp).toLocaleString(),
        desc: step.description,
        details: {
          '操作人员': step.operator,
          '操作地点': step.location,
          '操作时间': new Date(step.timestamp).toLocaleString()
        }
      }))
    }
    
    // 更新统计
    stats.value.todayQueries++
    stats.value.successQueries++
    
  } catch (error) {
    console.error('查询失败:', error)
    alert(error.message || '查询失败，请检查溯源码是否正确')
  } finally {
    loading.value = false
  }
}

function quickQuery(historyCode) {
  code.value = historyCode
  manualQuery()
}

function showDemo() {
  code.value = 'DEMO-TRACE-001'
  manualQuery()
}

function printResult() {
  window.print()
}

function shareResult() {
  if (navigator.share) {
    navigator.share({
      title: '溯源查询结果',
      text: `产品：${result.value.name}，溯源码：${result.value.code}`,
      url: window.location.href
    })
  } else {
    const text = `产品：${result.value.name}，溯源码：${result.value.code}，查询时间：${new Date().toLocaleString()}`
    navigator.clipboard.writeText(text).then(() => {
      alert('结果已复制到剪贴板')
    })
  }
}

function downloadReport() {
  // 模拟下载
  const link = document.createElement('a')
  link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
    `溯源报告\n产品：${result.value.name}\n溯源码：${result.value.code}\n生产地：${result.value.origin}\n生产日期：${result.value.date}`
  )
  link.download = `溯源报告_${result.value.code}.txt`
  link.click()
}

function resetQuery() {
  result.value = null
  code.value = ''
}

function formatTime(timeStr) {
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
  return time.toLocaleDateString()
}

// 加载统计数据
async function loadStats() {
  try {
    const response = await statisticsAPI.getStatistics()
    const data = response.data
    
    stats.value = {
      todayQueries: data.totalQueries,
      successQueries: Math.floor(data.totalQueries * 0.9),
      productTypes: data.categoryDistribution?.length || 0
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 使用默认值
    stats.value = {
      todayQueries: 0,
      successQueries: 0,
      productTypes: 0
    }
  }
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .trace-query-page {
    padding: 1rem;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .ml-20 {
    margin-left: 4rem;
  }
}
</style>

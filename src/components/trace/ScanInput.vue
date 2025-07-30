<template>
  <div class="scan-input">
    <div class="flex flex-col items-center space-y-4">
      <!-- 扫码按钮 -->
      <button @click="startScan" 
              class="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        <i class="fa fa-qrcode mr-2"></i>
        扫码查询
      </button>
      
      <!-- 手动输入 -->
      <div class="flex w-full max-w-md">
        <input v-model="code" 
               placeholder="手动输入溯源码" 
               class="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               @keyup.enter="manualQuery">
        <button @click="manualQuery" 
                :disabled="!code || loading"
                class="px-6 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <i v-if="loading" class="fa fa-spinner fa-spin"></i>
          <span v-else>查询</span>
        </button>
      </div>
      
      <!-- 摄像头预览 -->
      <div v-if="scanning" class="relative">
        <video ref="video" 
               class="w-80 h-60 border-2 border-blue-500 rounded-lg"
               autoplay 
               playsinline>
        </video>
        <div class="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none">
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-red-500"></div>
        </div>
        <button @click="stopScan" 
                class="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded text-sm">
          停止扫码
        </button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center text-blue-600">
        <i class="fa fa-spinner fa-spin mr-2"></i>
        <span>{{ scanning ? '识别中...' : '查询中...' }}</span>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>
      
      <!-- 历史记录 -->
      <div v-if="history.length > 0" class="w-full max-w-md">
        <h4 class="text-sm font-medium text-gray-700 mb-2">最近查询</h4>
        <div class="space-y-1">
          <div v-for="item in history.slice(0, 3)" :key="item.code" 
               @click="queryHistory(item.code)"
               class="flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
            <span class="text-sm">{{ item.code }}</span>
            <span class="text-xs text-gray-500">{{ formatTime(item.time) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, onMounted, onUnmounted } from 'vue'

const code = ref('TEST-TRACE-0001')
const scanning = ref(false)
const loading = ref(false)
const error = ref('')
const video = ref(null)
const stream = ref(null)
const history = ref([])

const emit = defineEmits(['onQuery'])

onMounted(() => {
  loadHistory()
})

onUnmounted(() => {
  stopScan()
})

function loadHistory() {
  const saved = localStorage.getItem('traceHistory')
  if (saved) {
    history.value = JSON.parse(saved)
  }
}

function saveToHistory(code) {
  const item = { code, time: new Date() }
  history.value.unshift(item)
  history.value = history.value.slice(0, 10) // 只保留最近10条
  localStorage.setItem('traceHistory', JSON.stringify(history.value))
}

async function startScan() {
  try {
    error.value = ''
    scanning.value = true
    loading.value = true
    
    // 请求摄像头权限
    stream.value = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } // 优先使用后置摄像头
    })
    
    if (video.value) {
      video.value.srcObject = stream.value
      loading.value = false
      
      // 这里应该集成二维码识别库，如 jsQR
      // 模拟扫码成功
      setTimeout(() => {
        const mockCode = 'SCAN-' + Date.now()
        code.value = mockCode
        stopScan()
        manualQuery()
      }, 3000)
    }
  } catch (err) {
    error.value = '无法访问摄像头，请检查权限设置'
    scanning.value = false
    loading.value = false
  }
}

function stopScan() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  scanning.value = false
  loading.value = false
}

async function manualQuery() {
  if (!code.value.trim()) {
    error.value = '请输入溯源码'
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    // 保存到历史记录
    saveToHistory(code.value)
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('onQuery', code.value)
  } catch (err) {
    error.value = '查询失败，请重试'
  } finally {
    loading.value = false
  }
}

function queryHistory(historyCode) {
  code.value = historyCode
  manualQuery()
}

function formatTime(time) {
  const now = new Date()
  const diff = now - new Date(time)
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
  return new Date(time).toLocaleDateString()
}
</script> 

<template>
  <div class="chart-wrapper">
    <div class="chart-header" v-if="title">
      <h4 class="chart-title">{{ title }}</h4>
      <div class="chart-actions" v-if="showActions">
        <button 
          @click="refreshChart"
          class="chart-action-btn"
          :disabled="loading"
        >
          <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loading }" />
        </button>
        <button 
          @click="downloadChart"
          class="chart-action-btn"
        >
          <ArrowDownTrayIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
    <div 
      ref="chartRef" 
      class="chart-container"
      :style="{ height: height }"
    ></div>
    <div v-if="loading" class="chart-loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: String,
  height: {
    type: String,
    default: '300px'
  },
  options: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['refresh', 'download'])

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

watch(() => props.options, (newOptions) => {
  if (chartInstance && newOptions) {
    chartInstance.setOption(newOptions, true)
  }
}, { deep: true })

watch(() => props.loading, (loading) => {
  if (chartInstance) {
    if (loading) {
      chartInstance.showLoading('default', {
        text: '加载中...',
        color: '#3b82f6',
        textColor: '#6b7280',
        maskColor: 'rgba(255, 255, 255, 0.8)'
      })
    } else {
      chartInstance.hideLoading()
    }
  }
})

function initChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.options)
  
  if (props.loading) {
    chartInstance.showLoading()
  }
}

function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

function refreshChart() {
  emit('refresh')
}

function downloadChart() {
  if (chartInstance) {
    const url = chartInstance.getDataURL({
      type: 'png',
      backgroundColor: '#fff'
    })
    const link = document.createElement('a')
    link.download = `${props.title || 'chart'}.png`
    link.href = url
    link.click()
  }
  emit('download')
}
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  flex: 1;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}

.chart-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chart-container {
  width: 100%;
  position: relative;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
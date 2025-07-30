<template>
  <div class="statistic-charts space-y-6">
    <div class="charts-header">
      <h3 class="text-xl font-bold text-gray-900 flex items-center">
        <ChartBarIcon class="h-6 w-6 text-blue-600 mr-3" />
        统计分析
      </h3>
      <p class="text-gray-600 mt-1">系统数据可视化分析</p>
    </div>

    <!-- 核心指标图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BaseChart
        title="溯源查询统计"
        :options="traceQueryOptions"
        :loading="loading"
        height="300px"
        @refresh="loadTraceData"
      />
      
      <BaseChart
        title="产品审核状态"
        :options="auditStatusOptions"
        :loading="loading"
        height="300px"
        @refresh="loadAuditData"
      />
    </div>

    <!-- 趋势分析 -->
    <div class="grid grid-cols-1 gap-6">
      <BaseChart
        title="系统使用趋势"
        :options="usageTrendOptions"
        :loading="loading"
        height="350px"
        @refresh="loadUsageData"
      />
    </div>

    <!-- 详细分析 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BaseChart
        title="农户活跃度"
        :options="farmerActivityOptions"
        :loading="loading"
        height="250px"
        @refresh="loadFarmerData"
      />
      
      <BaseChart
        title="产品类型分布"
        :options="productTypeOptions"
        :loading="loading"
        height="250px"
        @refresh="loadProductTypeData"
      />
      
      <BaseChart
        title="质量评级分布"
        :options="qualityRatingOptions"
        :loading="loading"
        height="250px"
        @refresh="loadQualityData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseChart from './charts/BaseChart.vue'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { statisticsAPI } from '@/api/trace'

const loading = ref(false)

// 溯源查询统计
const traceQueryOptions = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['总查询', '成功查询', '失败查询']
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总查询',
      type: 'bar',
      data: [],
      itemStyle: { color: '#3b82f6' }
    },
    {
      name: '成功查询',
      type: 'bar',
      data: [],
      itemStyle: { color: '#10b981' }
    },
    {
      name: '失败查询',
      type: 'bar',
      data: [],
      itemStyle: { color: '#ef4444' }
    }
  ]
})

// 产品审核状态
const auditStatusOptions = ref({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '审核状态',
      type: 'pie',
      radius: ['40%', '70%'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

// 系统使用趋势
const usageTrendOptions = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['用户访问', '数据录入', '查询请求']
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '用户访问',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: { color: '#3b82f6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ]
        }
      }
    },
    {
      name: '数据录入',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: { color: '#10b981' }
    },
    {
      name: '查询请求',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: { color: '#f59e0b' }
    }
  ]
})

// 农户活跃度
const farmerActivityOptions = ref({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '农户活跃度',
      type: 'pie',
      radius: '70%',
      data: [],
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      }
    }
  ]
})

// 产品类型分布
const productTypeOptions = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#6366f1' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
})

// 质量评级分布
const qualityRatingOptions = ref({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '质量评级',
      type: 'pie',
      radius: '60%',
      data: [],
      label: {
        show: true,
        formatter: '{b}: {d}%'
      }
    }
  ]
})

// 数据加载函数
async function loadTraceData() {
  try {
    const response = await statisticsAPI.getStatistics()
    const trendData = response.data.queryTrend
    
    const days = trendData.map(item => {
      const date = new Date(item.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    })
    const totalQueries = trendData.map(item => item.count)
    const successQueries = totalQueries.map(total => Math.floor(total * 0.9))
    const failedQueries = totalQueries.map((total, i) => total - successQueries[i])
    
    traceQueryOptions.value.xAxis.data = days
    traceQueryOptions.value.series[0].data = totalQueries
    traceQueryOptions.value.series[1].data = successQueries
    traceQueryOptions.value.series[2].data = failedQueries
  } catch (error) {
    console.error('加载溯源数据失败:', error)
  }
}

async function loadAuditData() {
  const data = [
    { value: 60, name: '已通过', itemStyle: { color: '#10b981' } },
    { value: 25, name: '待审核', itemStyle: { color: '#f59e0b' } },
    { value: 15, name: '已拒绝', itemStyle: { color: '#ef4444' } }
  ]
  
  auditStatusOptions.value.series[0].data = data
}

async function loadUsageData() {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }))
  }
  
  usageTrendOptions.value.xAxis.data = dates
  usageTrendOptions.value.series[0].data = dates.map(() => Math.floor(Math.random() * 500) + 200)
  usageTrendOptions.value.series[1].data = dates.map(() => Math.floor(Math.random() * 100) + 50)
  usageTrendOptions.value.series[2].data = dates.map(() => Math.floor(Math.random() * 300) + 150)
}

async function loadFarmerData() {
  const data = [
    { value: 45, name: '高活跃', itemStyle: { color: '#10b981' } },
    { value: 35, name: '中活跃', itemStyle: { color: '#f59e0b' } },
    { value: 20, name: '低活跃', itemStyle: { color: '#ef4444' } }
  ]
  
  farmerActivityOptions.value.series[0].data = data
}

async function loadProductTypeData() {
  const types = ['蔬菜', '水果', '粮食', '肉类', '水产', '其他']
  const data = types.map(() => Math.floor(Math.random() * 100) + 20)
  
  productTypeOptions.value.xAxis.data = types
  productTypeOptions.value.series[0].data = data
}

async function loadQualityData() {
  const data = [
    { value: 40, name: '优质', itemStyle: { color: '#10b981' } },
    { value: 35, name: '良好', itemStyle: { color: '#3b82f6' } },
    { value: 20, name: '合格', itemStyle: { color: '#f59e0b' } },
    { value: 5, name: '不合格', itemStyle: { color: '#ef4444' } }
  ]
  
  qualityRatingOptions.value.series[0].data = data
}

async function loadAllData() {
  loading.value = true
  try {
    await Promise.all([
      loadTraceData(),
      loadAuditData(),
      loadUsageData(),
      loadFarmerData(),
      loadProductTypeData(),
      loadQualityData()
    ])
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAllData()
})
</script>

<style scoped>
.charts-header {
  text-align: center;
  margin-bottom: 2rem;
}

.statistic-charts {
  padding: 1rem;
}
</style> 

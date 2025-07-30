<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <QrCodeIcon class="h-8 w-8 text-blue-600 mr-3" />
            溯源码管理
          </h1>
          <p class="text-gray-500 mt-1">管理已生成的溯源码，支持查询、导出和状态管理</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="goToAdd"
            class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            生成溯源码
          </button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <QrCodeIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">总计生成</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.totalCodes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">已使用</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.usedCodes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">待使用</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.pendingCodes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircleIcon class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">已过期</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.expiredCodes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">码类型</label>
          <select 
            v-model="filters.codeType" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部类型</option>
            <option value="product">产品码</option>
            <option value="batch">批次码</option>
            <option value="package">包装码</option>
            <option value="logistics">物流码</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">状态</label>
          <select 
            v-model="filters.status" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部状态</option>
            <option value="unused">未使用</option>
            <option value="used">已使用</option>
            <option value="expired">已过期</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
          <select 
            v-model="filters.timeRange" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索</label>
          <div class="relative">
            <MagnifyingGlassIcon class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              v-model="filters.search" 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="搜索溯源码..." 
            />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-4 border-t">
        <div class="flex items-center space-x-3">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            重置筛选
          </button>
          <span class="text-sm text-gray-500">
            共找到 {{ filteredCodes.length }} 条记录
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="batchExport"
            :disabled="selectedCodes.length === 0"
            class="flex items-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
            批量导出 ({{ selectedCodes.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-xl shadow-sm">
      <DataTable 
        :columns="columns" 
        :data="paginatedData" 
        :loading="loading"
        :total="filteredCodes.length"
        :page-size="pageSize"
        :current-page="currentPage"
        :selectable="true"
        :selected-rows="selectedCodes"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange">
        
        <template #code="{ row }">
          <div class="flex items-center">
            <div class="font-mono text-sm font-medium text-gray-900">{{ row.code }}</div>
            <button 
              @click="copyCode(row.code)" 
              class="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="复制"
            >
              <DocumentDuplicateIcon class="h-4 w-4" />
            </button>
          </div>
        </template>

        <template #type="{ row }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getTypeClass(row.type)"
          >
            {{ getTypeLabel(row.type) }}
          </span>
        </template>

        <template #status="{ row }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusClass(row.status)"
          >
            <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(row.status)"></span>
            {{ getStatusLabel(row.status) }}
          </span>
        </template>

        <template #createdAt="{ row }">
          <div class="text-sm text-gray-900">{{ formatDate(row.createdAt) }}</div>
        </template>

        <template #usedAt="{ row }">
          <div class="text-sm text-gray-900">
            {{ row.usedAt ? formatDate(row.usedAt) : '-' }}
          </div>
        </template>

        <template #expiresAt="{ row }">
          <div class="text-sm" :class="getExpiryClass(row.expiresAt)">
            {{ formatDate(row.expiresAt) }}
          </div>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <button 
              @click="showDetail(row)" 
              class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
              title="查看详情"
            >
              <EyeIcon class="h-4 w-4" />
            </button>
            <button 
              @click="showQrCode(row)" 
              class="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
              title="查看二维码"
            >
              <QrCodeIcon class="h-4 w-4" />
            </button>
            <button 
              v-if="row.status === 'unused'"
              @click="disableCode(row)" 
              class="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded transition-colors"
              title="禁用"
            >
              <NoSymbolIcon class="h-4 w-4" />
            </button>
            <button 
              @click="exportSingle(row)" 
              class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              title="导出"
            >
              <ArrowDownTrayIcon class="h-4 w-4" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">溯源码详情</h3>
            <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div v-if="selectedCode" class="p-6 space-y-6">
          <!-- 基本信息 -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">基本信息</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">溯源码:</span>
                <span class="ml-2 font-mono font-medium">{{ selectedCode.code }}</span>
              </div>
              <div>
                <span class="text-gray-500">类型:</span>
                <span class="ml-2">{{ getTypeLabel(selectedCode.type) }}</span>
              </div>
              <div>
                <span class="text-gray-500">状态:</span>
                <span class="ml-2">{{ getStatusLabel(selectedCode.status) }}</span>
              </div>
              <div>
                <span class="text-gray-500">生成时间:</span>
                <span class="ml-2">{{ formatDate(selectedCode.createdAt) }}</span>
              </div>
              <div>
                <span class="text-gray-500">有效期至:</span>
                <span class="ml-2">{{ formatDate(selectedCode.expiresAt) }}</span>
              </div>
              <div v-if="selectedCode.usedAt">
                <span class="text-gray-500">使用时间:</span>
                <span class="ml-2">{{ formatDate(selectedCode.usedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 二维码 -->
          <div class="text-center">
            <h4 class="text-md font-medium text-gray-900 mb-3">二维码</h4>
            <div class="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <div class="w-32 h-32 bg-gray-100 flex items-center justify-center">
                <QrCodeIcon class="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">扫描查看溯源信息</p>
          </div>

          <!-- 使用记录 -->
          <div v-if="selectedCode.status === 'used'">
            <h4 class="text-md font-medium text-gray-900 mb-3">使用记录</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm space-y-2">
                <div>
                  <span class="text-gray-500">使用者:</span>
                  <span class="ml-2">{{ selectedCode.usedBy || '未知' }}</span>
                </div>
                <div>
                  <span class="text-gray-500">使用IP:</span>
                  <span class="ml-2">{{ selectedCode.usedIp || '未知' }}</span>
                </div>
                <div>
                  <span class="text-gray-500">关联产品:</span>
                  <span class="ml-2">{{ selectedCode.productName || '未关联' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t bg-gray-50 flex justify-end space-x-4">
          <button @click="exportSingle(selectedCode)" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            导出
          </button>
          <button @click="closeDetail" 
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  QrCodeIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  NoSymbolIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import DataTable from '../components/common/DataTable.vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const showDetailModal = ref(false)
const selectedCode = ref(null)
const selectedCodes = ref([])
const currentPage = ref(1)
const pageSize = ref(20)

// 筛选条件
const filters = ref({
  codeType: '',
  status: '',
  timeRange: '',
  search: ''
})

// 统计数据
const statistics = ref({
  totalCodes: 0,
  usedCodes: 0,
  pendingCodes: 0,
  expiredCodes: 0
})

// 溯源码数据
const codes = ref([])

// 表格列配置
const columns = [
  { title: '溯源码', key: 'code', sortable: true, width: '200px' },
  { title: '类型', key: 'type', width: '100px' },
  { title: '状态', key: 'status', width: '100px' },
  { title: '生成时间', key: 'createdAt', sortable: true, width: '150px' },
  { title: '使用时间', key: 'usedAt', sortable: true, width: '150px' },
  { title: '有效期至', key: 'expiresAt', sortable: true, width: '150px' },
  { title: '操作', key: 'actions', width: '150px' }
]

// 计算属性
const filteredCodes = computed(() => {
  let result = codes.value

  // 类型筛选
  if (filters.value.codeType) {
    result = result.filter(code => code.type === filters.value.codeType)
  }

  // 状态筛选
  if (filters.value.status) {
    result = result.filter(code => code.status === filters.value.status)
  }

  // 搜索筛选
  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    result = result.filter(code => 
      code.code.toLowerCase().includes(query) ||
      (code.productName && code.productName.toLowerCase().includes(query))
    )
  }

  // 时间范围筛选
  if (filters.value.timeRange) {
    const now = new Date()
    const startDate = getTimeRangeStart(filters.value.timeRange, now)
    result = result.filter(code => new Date(code.createdAt) >= startDate)
  }

  return result
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCodes.value.slice(start, end)
})

// 方法
function getTypeLabel(type) {
  const labels = {
    product: '产品码',
    batch: '批次码',
    package: '包装码',
    logistics: '物流码'
  }
  return labels[type] || '未知'
}

function getTypeClass(type) {
  const classes = {
    product: 'bg-blue-100 text-blue-800',
    batch: 'bg-green-100 text-green-800',
    package: 'bg-yellow-100 text-yellow-800',
    logistics: 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  const labels = {
    unused: '未使用',
    used: '已使用',
    expired: '已过期'
  }
  return labels[status] || '未知'
}

function getStatusClass(status) {
  const classes = {
    unused: 'bg-green-100 text-green-800',
    used: 'bg-blue-100 text-blue-800',
    expired: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusDotClass(status) {
  const classes = {
    unused: 'bg-green-400',
    used: 'bg-blue-400',
    expired: 'bg-red-400'
  }
  return classes[status] || 'bg-gray-400'
}

function getExpiryClass(expiresAt) {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysLeft < 0) return 'text-red-600'
  if (daysLeft <= 7) return 'text-yellow-600'
  return 'text-gray-900'
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

function getTimeRangeStart(range, now) {
  switch (range) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case 'week':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      return weekStart
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1)
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3)
      return new Date(now.getFullYear(), quarter * 3, 1)
    default:
      return new Date(0)
  }
}

function handlePageChange(page) {
  currentPage.value = page
}

function handleSortChange(sort) {
  // TODO: 实现排序逻辑
  console.log('Sort:', sort)
}

function handleSelectionChange(selection) {
  selectedCodes.value = selection
}

function resetFilters() {
  filters.value = {
    codeType: '',
    status: '',
    timeRange: '',
    search: ''
  }
}

function goToAdd() {
  router.push('/trace/admin/code/add')
}

function showDetail(code) {
  selectedCode.value = code
  showDetailModal.value = true
}

function closeDetail() {
  showDetailModal.value = false
  selectedCode.value = null
}

function showQrCode(code) {
  // TODO: 显示二维码弹窗
  console.log('Show QR code for:', code.code)
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showMessage('已复制到剪贴板', 'success')
  }).catch(() => {
    showMessage('复制失败', 'error')
  })
}

function disableCode(code) {
  if (confirm('确定要禁用这个溯源码吗？')) {
    code.status = 'expired'
    showMessage('溯源码已禁用', 'success')
  }
}

function exportSingle(code) {
  // TODO: 导出单个溯源码
  console.log('Export single code:', code.code)
  showMessage('导出成功', 'success')
}

function batchExport() {
  if (selectedCodes.value.length === 0) return
  
  // TODO: 批量导出溯源码
  console.log('Batch export codes:', selectedCodes.value)
  showMessage(`已导出 ${selectedCodes.value.length} 个溯源码`, 'success')
}

function showMessage(message, type = 'info') {
  // TODO: 实现消息提示组件
  console.log(`${type}: ${message}`)
  alert(message)
}

async function loadCodes() {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    codes.value = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      code: `TR${String(i + 1).padStart(8, '0')}`,
      type: ['product', 'batch', 'package', 'logistics'][Math.floor(Math.random() * 4)],
      status: ['unused', 'used', 'expired'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      usedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : null,
      expiresAt: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      productName: Math.random() > 0.5 ? '有机苹果' : null,
      usedBy: Math.random() > 0.5 ? '张三农场' : null,
      usedIp: Math.random() > 0.5 ? '192.168.1.100' : null
    }))
    
    updateStatistics()
  } catch (error) {
    console.error('加载溯源码数据失败:', error)
  } finally {
    loading.value = false
  }
}

function updateStatistics() {
  statistics.value = {
    totalCodes: codes.value.length,
    usedCodes: codes.value.filter(c => c.status === 'used').length,
    pendingCodes: codes.value.filter(c => c.status === 'unused').length,
    expiredCodes: codes.value.filter(c => c.status === 'expired').length
  }
}

// 生命周期
onMounted(() => {
  loadCodes()
})

// 监听筛选条件变化
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })
</script> 

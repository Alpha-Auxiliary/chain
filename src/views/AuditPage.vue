<template>
  <div class="audit-page p-6 space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="stat-card bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">待审核</p>
            <p class="text-2xl font-bold">{{ stats.pending }}</p>
          </div>
          <ExclamationTriangleIcon class="h-8 w-8 text-blue-200" />
        </div>
      </div>
      <div class="stat-card bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">已通过</p>
            <p class="text-2xl font-bold">{{ stats.approved }}</p>
          </div>
          <CheckCircleIcon class="h-8 w-8 text-green-200" />
        </div>
      </div>
      <div class="stat-card bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-100 text-sm">已拒绝</p>
            <p class="text-2xl font-bold">{{ stats.rejected }}</p>
          </div>
          <XCircleIcon class="h-8 w-8 text-red-200" />
        </div>
      </div>
      <div class="stat-card bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">总计</p>
            <p class="text-2xl font-bold">{{ stats.total }}</p>
          </div>
          <DocumentTextIcon class="h-8 w-8 text-purple-200" />
        </div>
      </div>
    </div>

    <!-- 搜索和操作区域 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <!-- 搜索表单 -->
        <div class="flex flex-wrap gap-3 flex-1">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              v-model="search.name" 
              placeholder="搜索姓名" 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-40"
            />
          </div>
          <div class="relative">
            <IdentificationIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              v-model="search.idCard" 
              placeholder="身份证号" 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-48"
            />
          </div>
          <select 
            v-model="search.status" 
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">全部状态</option>
            <option value="待审核">待审核</option>
            <option value="已通过">已通过</option>
            <option value="未通过">未通过</option>
          </select>
          <select 
            v-model="search.category" 
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">全部品类</option>
            <option value="蔬菜">蔬菜</option>
            <option value="水果">水果</option>
            <option value="粮食">粮食</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button 
            class="btn-primary flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            @click="doSearch"
          >
            <MagnifyingGlassIcon class="h-4 w-4" />
            查询
          </button>
          <button 
            class="btn-secondary flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            @click="resetSearch"
          >
            <ArrowPathIcon class="h-4 w-4" />
            重置
          </button>
          <button 
            class="btn-success flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            @click="addData"
          >
            <PlusIcon class="h-4 w-4" />
            添加
          </button>
        </div>
      </div>

      <!-- 批量操作 -->
      <div v-if="selectedItems.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between">
          <span class="text-blue-700 text-sm">已选择 {{ selectedItems.length }} 项</span>
          <div class="flex gap-2">
            <button 
              class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              @click="batchApprove"
            >
              批量通过
            </button>
            <button 
              class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              @click="batchReject"
            >
              批量拒绝
            </button>
            <button 
              class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              @click="clearSelection"
            >
              取消选择
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序号</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">审核状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">农产品品类</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">身份证号</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上传时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr 
              v-for="(row, idx) in paginatedData" 
              :key="row.id"
              class="hover:bg-gray-50 transition-colors duration-150"
              :class="{ 'bg-blue-50': selectedItems.includes(row.id) }"
            >
              <td class="px-4 py-3">
                <input 
                  type="checkbox" 
                  :checked="selectedItems.includes(row.id)"
                  @change="toggleSelect(row.id)"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
              <td class="px-4 py-3">
                <span :class="getStatusClass(row.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ row.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ row.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">
                <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{{ row.category }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ maskIdCard(row.idCard) }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(row.uploadTime) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button 
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    @click="showDetail(row)"
                  >
                    详情
                  </button>
                  <button 
                    v-if="row.status === '待审核'"
                    class="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                    @click="approve(row)"
                  >
                    通过
                  </button>
                  <button 
                    v-if="row.status === '待审核'"
                    class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    @click="reject(row)"
                  >
                    拒绝
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-700">
            <span>共 {{ filteredData.length }} 条记录</span>
            <span class="mx-2">|</span>
            <span>每页显示</span>
            <select 
              v-model="pageSize" 
              class="mx-2 border border-gray-300 rounded px-2 py-1 text-sm"
              @change="currentPage = 1"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <span>条</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              :disabled="currentPage <= 1"
              @click="currentPage--"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-sm text-gray-700">
              第 {{ currentPage }} / {{ totalPages }} 页
            </span>
            <button 
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <transition name="modal">
      <div v-if="detailDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <!-- 弹窗头部 -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon class="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">审核详情</h3>
                <p class="text-sm text-gray-600">查看详细信息</p>
              </div>
            </div>
            <button 
              @click="detailDialog = false"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="p-6 overflow-y-auto max-h-[60vh]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(value, key) in detailRow" :key="key" class="detail-item">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ getFieldLabel(key) }}</label>
                <div class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {{ formatDetailValue(key, value) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 弹窗底部 -->
          <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button 
              @click="detailDialog = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              关闭
            </button>
            <button 
              v-if="detailRow.status === '待审核'"
              @click="approve(detailRow); detailDialog = false"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              通过审核
            </button>
            <button 
              v-if="detailRow.status === '待审核'"
              @click="reject(detailRow); detailDialog = false"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              拒绝审核
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowPathIcon,
  IdentificationIcon,
  DocumentTextIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

// 响应式数据
const search = ref({ 
  name: '', 
  idCard: '', 
  status: '', 
  category: '' 
})

const data = ref([
  { 
    id: 1, 
    status: '待审核', 
    name: '张三', 
    category: '蔬菜', 
    idCard: '123456789012345678', 
    uploadTime: '2024-01-15 10:30:00',
    phone: '13800138000',
    address: '北京市朝阳区',
    description: '有机蔬菜种植基地'
  },
  { 
    id: 2, 
    status: '已通过', 
    name: '李四', 
    category: '水果', 
    idCard: '987654321098765432', 
    uploadTime: '2024-01-14 14:20:00',
    phone: '13900139000',
    address: '上海市浦东新区',
    description: '优质水果种植园'
  },
  { 
    id: 3, 
    status: '未通过', 
    name: '王五', 
    category: '粮食', 
    idCard: '456789123456789012', 
    uploadTime: '2024-01-13 09:15:00',
    phone: '13700137000',
    address: '广州市天河区',
    description: '绿色粮食生产基地'
  }
])

const selectedItems = ref([])
const detailDialog = ref(false)
const detailRow = ref({})
const currentPage = ref(1)
const pageSize = ref(10)
const lastUpdateTime = ref(new Date().toLocaleString())

// 计算属性
const filteredData = computed(() => {
  return data.value.filter(row => {
    return (!search.value.name || row.name.includes(search.value.name)) &&
           (!search.value.idCard || row.idCard.includes(search.value.idCard)) &&
           (!search.value.status || row.status === search.value.status) &&
           (!search.value.category || row.category === search.value.category)
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize.value)
})

const allSelected = computed(() => {
  return paginatedData.value.length > 0 && 
         paginatedData.value.every(item => selectedItems.value.includes(item.id))
})

const stats = computed(() => {
  const pending = data.value.filter(item => item.status === '待审核').length
  const approved = data.value.filter(item => item.status === '已通过').length
  const rejected = data.value.filter(item => item.status === '未通过').length
  return {
    pending,
    approved,
    rejected,
    total: data.value.length
  }
})

// 方法
function getStatusClass(status) {
  const classes = {
    '待审核': 'bg-yellow-100 text-yellow-800',
    '已通过': 'bg-green-100 text-green-800',
    '未通过': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function maskIdCard(idCard) {
  if (!idCard || idCard.length < 8) return idCard
  return idCard.slice(0, 4) + '****' + idCard.slice(-4)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('zh-CN')
}

function getFieldLabel(key) {
  const labels = {
    id: 'ID',
    name: '姓名',
    category: '农产品品类',
    idCard: '身份证号',
    phone: '联系电话',
    address: '地址',
    uploadTime: '上传时间',
    status: '审核状态',
    description: '描述'
  }
  return labels[key] || key
}

function formatDetailValue(key, value) {
  if (key === 'uploadTime') {
    return formatDate(value)
  }
  if (key === 'idCard') {
    return value
  }
  return value
}

function showDetail(row) {
  detailRow.value = { ...row }
  detailDialog.value = true
}

function approve(row) {
  row.status = '已通过'
  updateLastUpdateTime()
}

function reject(row) {
  row.status = '未通过'
  updateLastUpdateTime()
}

function toggleSelect(id) {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedItems.value = selectedItems.value.filter(id => 
      !paginatedData.value.some(item => item.id === id)
    )
  } else {
    paginatedData.value.forEach(item => {
      if (!selectedItems.value.includes(item.id)) {
        selectedItems.value.push(item.id)
      }
    })
  }
}

function clearSelection() {
  selectedItems.value = []
}

function batchApprove() {
  selectedItems.value.forEach(id => {
    const item = data.value.find(row => row.id === id)
    if (item) item.status = '已通过'
  })
  selectedItems.value = []
  updateLastUpdateTime()
}

function batchReject() {
  selectedItems.value.forEach(id => {
    const item = data.value.find(row => row.id === id)
    if (item) item.status = '未通过'
  })
  selectedItems.value = []
  updateLastUpdateTime()
}

function doSearch() {
  currentPage.value = 1
  updateLastUpdateTime()
}

function resetSearch() {
  search.value = { name: '', idCard: '', status: '', category: '' }
  currentPage.value = 1
  updateLastUpdateTime()
}

function addData() {
  alert('添加功能可后续实现')
}

function updateLastUpdateTime() {
  lastUpdateTime.value = new Date().toLocaleString()
}

// 生命周期
onMounted(() => {
  updateLastUpdateTime()
})
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.detail-item {
  transition: all 0.2s ease;
}

.detail-item:hover {
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .audit-page {
    padding: 1rem;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 

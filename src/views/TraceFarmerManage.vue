<template>
  <div class="space-y-6">
    <!-- 页面标题和统计 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <UsersIcon class="h-8 w-8 text-green-600 mr-3" />
            农户数据管理
          </h1>
          <p class="text-gray-500 mt-1">管理农户信息、产品数据和生产记录</p>
        </div>
        <div class="flex items-center space-x-4">
          <router-link 
            to="/farmer/add"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            新增农户
          </router-link>
          <button
            @click="exportData"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
            导出数据
          </button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <UsersIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">总农户数</p>
              <p class="text-2xl font-bold text-blue-600">{{ statistics.totalFarmers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">已认证</p>
              <p class="text-2xl font-bold text-green-600">{{ statistics.certifiedFarmers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">待审核</p>
              <p class="text-2xl font-bold text-yellow-600">{{ statistics.pendingFarmers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <ArchiveBoxIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">产品种类</p>
              <p class="text-2xl font-bold text-purple-600">{{ statistics.productTypes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索农户</label>
          <div class="relative">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索农户姓名、电话、产品..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">产品分类</label>
          <select
            v-model="filters.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">全部分类</option>
            <option value="fruit">水果类</option>
            <option value="vegetable">蔬菜类</option>
            <option value="grain">粮食类</option>
            <option value="meat">肉类</option>
            <option value="aquatic">水产类</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">认证状态</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">全部状态</option>
            <option value="certified">已认证</option>
            <option value="pending">待审核</option>
            <option value="rejected">已拒绝</option>
            <option value="draft">草稿</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">注册时间</label>
          <select
            v-model="filters.timeRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
          </select>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <div class="flex items-center space-x-2">
          <button
            @click="resetFilters"
            class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          >
            重置筛选
          </button>
          <span class="text-sm text-gray-500">
            共找到 {{ filteredFarmers.length }} 条记录
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">每页显示:</span>
          <select
            v-model="pageSize"
            class="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                农户信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                产品信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                农场信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                注册时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="farmer in paginatedFarmers" :key="farmer.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  v-model="selectedFarmers"
                  :value="farmer.id"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <UserIcon class="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ farmer.name }}</div>
                    <div class="text-sm text-gray-500">{{ farmer.phone }}</div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ farmer.productName }}</div>
                <div class="text-sm text-gray-500">{{ getCategoryLabel(farmer.category) }}</div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ farmer.farmName || '未填写' }}</div>
                <div class="text-sm text-gray-500">{{ farmer.farmArea }}亩</div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(farmer.status)">
                  {{ getStatusLabel(farmer.status) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(farmer.createdAt) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewFarmer(farmer)"
                    class="text-blue-600 hover:text-blue-900"
                    title="查看详情"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="editFarmer(farmer)"
                    class="text-green-600 hover:text-green-900"
                    title="编辑"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="auditFarmer(farmer)"
                    v-if="farmer.status === 'pending'"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="审核"
                  >
                    <DocumentCheckIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteFarmer(farmer)"
                    class="text-red-600 hover:text-red-900"
                    title="删除"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            上一页
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
        
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredFarmers.length) }}</span> 条，
              共 <span class="font-medium">{{ filteredFarmers.length }}</span> 条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-green-50 border-green-500 text-green-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedFarmers.length > 0" 
         class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-4 flex items-center space-x-4 z-50">
      <span class="text-sm text-gray-600">已选择 {{ selectedFarmers.length }} 项</span>
      <div class="flex items-center space-x-2">
        <button
          @click="batchAudit"
          class="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
        >
          批量审核
        </button>
        <button
          @click="batchExport"
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          批量导出
        </button>
        <button
          @click="batchDelete"
          class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          批量删除
        </button>
        <button
          @click="clearSelection"
          class="px-3 py-1 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50"
        >
          取消选择
        </button>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <FarmerDetailModal
      v-if="showDetailModal"
      :farmer="selectedFarmer"
      @close="closeDetailModal"
    />

    <!-- 审核弹窗 -->
    <AuditModal
      v-if="showAuditModal"
      :farmer="selectedFarmer"
      @close="closeAuditModal"
      @submit="handleAuditSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  UsersIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon,
  PencilIcon,
  DocumentCheckIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import FarmerDetailModal from '../components/FarmerDetailModal.vue'
import AuditModal from '../components/AuditModal.vue'
import { userAPI } from '@/api/trace'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedFarmers = ref([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const showDetailModal = ref(false)
const showAuditModal = ref(false)
const selectedFarmer = ref(null)

const filters = ref({
  category: '',
  status: '',
  timeRange: ''
})

const statistics = ref({
  totalFarmers: 0,
  certifiedFarmers: 0,
  pendingFarmers: 0,
  productTypes: 0
})

const farmers = ref([])

// 计算属性
const filteredFarmers = computed(() => {
  let result = farmers.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(farmer => 
      farmer.name.toLowerCase().includes(query) ||
      farmer.phone.includes(query) ||
      farmer.productName.toLowerCase().includes(query)
    )
  }

  // 分类过滤
  if (filters.value.category) {
    result = result.filter(farmer => farmer.category === filters.value.category)
  }

  // 状态过滤
  if (filters.value.status) {
    result = result.filter(farmer => farmer.status === filters.value.status)
  }

  // 时间过滤
  if (filters.value.timeRange) {
    const now = new Date()
    const filterDate = new Date()
    
    switch (filters.value.timeRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3)
        break
    }
    
    result = result.filter(farmer => new Date(farmer.createdAt) >= filterDate)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredFarmers.value.length / pageSize.value))

const paginatedFarmers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFarmers.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 监听器
watch([searchQuery, filters], () => {
  currentPage.value = 1
}, { deep: true })

watch(selectAll, (newVal) => {
  if (newVal) {
    selectedFarmers.value = paginatedFarmers.value.map(farmer => farmer.id)
  } else {
    selectedFarmers.value = []
  }
})

// 生命周期
onMounted(() => {
  loadFarmers()
  loadStatistics()
})

// 方法
function getCategoryLabel(category) {
  const labels = {
    fruit: '水果类',
    vegetable: '蔬菜类',
    grain: '粮食类',
    meat: '肉类',
    aquatic: '水产类'
  }
  return labels[category] || '未分类'
}

function getStatusLabel(status) {
  const labels = {
    certified: '已认证',
    pending: '待审核',
    rejected: '已拒绝',
    draft: '草稿'
  }
  return labels[status] || '未知'
}

function getStatusClass(status) {
  const classes = {
    certified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

function resetFilters() {
  filters.value = {
    category: '',
    status: '',
    timeRange: ''
  }
  searchQuery.value = ''
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedFarmers.value = paginatedFarmers.value.map(farmer => farmer.id)
  } else {
    selectedFarmers.value = []
  }
}

function clearSelection() {
  selectedFarmers.value = []
  selectAll.value = false
}

// 分页方法
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page) {
  if (typeof page === 'number') {
    currentPage.value = page
  }
}

// 操作方法
function viewFarmer(farmer) {
  selectedFarmer.value = farmer
  showDetailModal.value = true
}

function editFarmer(farmer) {
  // 跳转到编辑页面
  router.push(`/trace/farmer/edit/${farmer.id}`)
}

function auditFarmer(farmer) {
  selectedFarmer.value = farmer
  showAuditModal.value = true
}

function deleteFarmer(farmer) {
  if (confirm(`确定要删除农户 ${farmer.name} 的数据吗？`)) {
    // 执行删除操作
    farmers.value = farmers.value.filter(f => f.id !== farmer.id)
    updateStatistics()
  }
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedFarmer.value = null
}

function closeAuditModal() {
  showAuditModal.value = false
  selectedFarmer.value = null
}

function handleAuditSubmit(result) {
  // 处理审核结果
  const farmer = farmers.value.find(f => f.id === selectedFarmer.value.id)
  if (farmer) {
    farmer.status = result.status
    farmer.auditRemark = result.remark
    farmer.auditTime = new Date().toISOString()
  }
  updateStatistics()
  closeAuditModal()
}

// 批量操作
function batchAudit() {
  if (selectedFarmers.value.length === 0) return
  // 实现批量审核逻辑
  console.log('批量审核:', selectedFarmers.value)
}

function batchExport() {
  if (selectedFarmers.value.length === 0) return
  // 实现批量导出逻辑
  console.log('批量导出:', selectedFarmers.value)
}

function batchDelete() {
  if (selectedFarmers.value.length === 0) return
  if (confirm(`确定要删除选中的 ${selectedFarmers.value.length} 条记录吗？`)) {
    farmers.value = farmers.value.filter(f => !selectedFarmers.value.includes(f.id))
    clearSelection()
    updateStatistics()
  }
}

function exportData() {
  // 实现数据导出逻辑
  console.log('导出所有数据')
}

// 数据加载
async function loadFarmers() {
  try {
    const response = await userAPI.getUsers({
      role: 'farmer',
      page: currentPage.value,
      limit: pageSize.value,
      search: searchForm.value.name
    })
    
    farmers.value = response.data.map(user => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      productName: '待完善', // 需要关联产品表
      category: '待完善',
      farmName: '待完善',
      farmArea: 0,
      status: user.status === 'active' ? 'certified' : 'pending',
      createdAt: user.created_at
    }))
    
    pagination.value = response.pagination
    updateStatistics()
  } catch (error) {
    console.error('加载农户数据失败:', error)
  }
}

function loadStatistics() {
  // 模拟统计数据
  statistics.value = {
    totalFarmers: 156,
    certifiedFarmers: 98,
    pendingFarmers: 23,
    productTypes: 45
  }
}

function updateStatistics() {
  const certified = farmers.value.filter(f => f.status === 'certified').length
  const pending = farmers.value.filter(f => f.status === 'pending').length
  
  statistics.value = {
    totalFarmers: farmers.value.length,
    certifiedFarmers: certified,
    pendingFarmers: pending,
    productTypes: new Set(farmers.value.map(f => f.category)).size
  }
}
</script> 

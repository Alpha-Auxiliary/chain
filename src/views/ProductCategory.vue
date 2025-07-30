<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <ArchiveBoxIcon class="h-8 w-8 text-green-600 mr-3" />
            产品分类管理
          </h1>
          <p class="text-gray-600 mt-1">管理农产品分类信息，支持层级分类和状态控制</p>
        </div>
        <div class="flex items-center space-x-3">
          <span class="text-sm text-gray-500">
            共 {{ filteredData.length }} 个分类
          </span>
          <div class="h-6 border-l border-gray-300"></div>
          <button
            @click="exportData"
            class="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-1" />
            导出
          </button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <ArchiveBoxIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">总分类数</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.total }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <CheckCircleIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">启用中</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.active }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-lg">
            <ClockIcon class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">已停用</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.inactive }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <TagIcon class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">本月新增</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.thisMonth }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-xl shadow-sm">
      <DataTable 
        :columns="columns" 
        :data="paginatedData" 
        :loading="loading"
        :total="filteredData.length"
        :page-size="pageSize"
        :current-page="currentPage"
        :selectable="true"
        :selected-rows="selectedRows"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange">
        
        <template #toolbar-left>
          <div class="flex items-center space-x-3">
            <button 
              @click="showAdd" 
              class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              添加分类
            </button>
            <button 
              @click="batchDelete" 
              :disabled="selectedRows.length === 0"
              class="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon class="h-4 w-4 mr-2" />
              批量删除 ({{ selectedRows.length }})
            </button>
          </div>
        </template>
        
        <template #toolbar-right>
          <div class="flex items-center space-x-3">
            <!-- 状态筛选 -->
            <select 
              v-model="filters.status" 
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">全部状态</option>
              <option value="正常">正常</option>
              <option value="停用">停用</option>
            </select>
            
            <!-- 搜索框 -->
            <div class="relative">
              <MagnifyingGlassIcon class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                v-model="filters.search" 
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="搜索分类名称或编码..." 
              />
            </div>
          </div>
        </template>

        <template #name="{ row }">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span class="text-white font-medium text-sm">{{ row.name.charAt(0) }}</span>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">{{ row.name }}</div>
              <div class="text-sm text-gray-500">编码: {{ row.code }}</div>
            </div>
          </div>
        </template>

        <template #status="{ row }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusClass(row.status)"
          >
            <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(row.status)"></span>
            {{ row.status }}
          </span>
        </template>

        <template #productCount="{ row }">
          <div class="text-sm text-gray-900">
            {{ row.productCount || 0 }} 个产品
          </div>
        </template>

        <template #createdAt="{ row }">
          <div class="text-sm text-gray-900">{{ formatDate(row.createdAt) }}</div>
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
              @click="showEdit(row)" 
              class="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
              title="编辑"
            >
              <PencilIcon class="h-4 w-4" />
            </button>
            <button 
              @click="toggleStatus(row)" 
              class="p-1 hover:bg-gray-100 rounded transition-colors"
              :class="row.status === '正常' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
              :title="row.status === '正常' ? '停用' : '启用'"
            >
              <component :is="row.status === '正常' ? PauseIcon : PlayIcon" class="h-4 w-4" />
            </button>
            <button 
              @click="showDelete(row)" 
              class="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
              title="删除"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
  
  <!-- 编辑对话框 -->
  <EditDialog 
    :visible="dialogVisible" 
    :title="isEditing ? '编辑分类' : '添加分类'"
    :loading="submitLoading"
    @submit="handleSubmit" 
    @cancel="closeDialog"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            分类名称 <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.name" 
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            placeholder="请输入分类名称" 
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            分类编码 <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.code" 
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            placeholder="请输入分类编码" 
          />
          <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">上级分类</label>
          <select 
            v-model="form.parentId" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">无上级分类</option>
            <option v-for="category in parentCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">状态</label>
          <select 
            v-model="form.status" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="正常">正常</option>
            <option value="停用">停用</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">排序</label>
        <input 
          v-model.number="form.sort" 
          type="number"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
          placeholder="数字越小排序越靠前" 
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
        <textarea 
          v-model="form.remark" 
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
          placeholder="请输入备注信息" 
        ></textarea>
      </div>
    </form>
  </EditDialog>

  <!-- 详情对话框 -->
  <DetailModal 
    :visible="detailVisible"
    :category="selectedCategory"
    @close="detailVisible = false"
    @edit="editFromDetail"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  ArchiveBoxIcon, 
  PlusIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/vue/24/outline'
import DataTable from '../components/common/DataTable.vue'
import EditDialog from '../components/common/EditDialog.vue'
import DetailModal from '../components/CategoryDetailModal.vue'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEditing = ref(false)
const selectedCategory = ref(null)
const selectedRows = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

// 表单数据
const form = ref({
  name: '',
  code: '',
  parentId: '',
  status: '正常',
  sort: 0,
  remark: ''
})

// 表单验证错误
const errors = ref({})

// 筛选条件
const filters = ref({
  search: '',
  status: ''
})

// 表格列配置
const columns = [
  { title: '分类信息', key: 'name', sortable: true },
  { title: '状态', key: 'status', width: '100px' },
  { title: '产品数量', key: 'productCount', width: '120px' },
  { title: '创建时间', key: 'createdAt', sortable: true, width: '150px' },
  { title: '操作', key: 'actions', width: '150px' }
]

// 模拟数据
const data = ref([
  { 
    id: 1, 
    name: '水果类', 
    code: 'FRUIT001',
    parentId: null,
    status: '正常', 
    sort: 1,
    productCount: 25,
    remark: '新鲜水果分类',
    createdAt: '2024-01-15 10:30:00'
  },
  { 
    id: 2, 
    name: '蔬菜类', 
    code: 'VEG001',
    parentId: null,
    status: '正常', 
    sort: 2,
    productCount: 18,
    remark: '绿色蔬菜分类',
    createdAt: '2024-01-16 14:20:00'
  },
  { 
    id: 3, 
    name: '粮食类', 
    code: 'GRAIN001',
    parentId: null,
    status: '停用', 
    sort: 3,
    productCount: 12,
    remark: '主要粮食作物',
    createdAt: '2024-01-17 09:15:00'
  },
  {
    id: 4,
    name: '苹果',
    code: 'APPLE001',
    parentId: 1,
    status: '正常',
    sort: 11,
    productCount: 8,
    remark: '苹果子分类',
    createdAt: '2024-01-18 16:45:00'
  }
])

// 计算属性
const filteredData = computed(() => {
  let result = data.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status)
  }

  return result
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const statistics = computed(() => ({
  total: data.value.length,
  active: data.value.filter(item => item.status === '正常').length,
  inactive: data.value.filter(item => item.status === '停用').length,
  thisMonth: data.value.filter(item => {
    const created = new Date(item.createdAt)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length
}))

const parentCategories = computed(() => {
  return data.value.filter(item => !item.parentId && (!isEditing.value || item.id !== form.value.id))
})

// 方法
function showAdd() {
  isEditing.value = false
  form.value = {
    name: '',
    code: '',
    parentId: '',
    status: '正常',
    sort: 0,
    remark: ''
  }
  errors.value = {}
  dialogVisible.value = true
}

function showEdit(row) {
  isEditing.value = true
  form.value = { ...row }
  errors.value = {}
  dialogVisible.value = true
}

function showDetail(row) {
  selectedCategory.value = row
  detailVisible.value = true
}

function editFromDetail(category) {
  detailVisible.value = false
  showEdit(category)
}

function showDelete(row) {
  if (confirm(`确定要删除分类"${row.name}"吗？\n删除后该分类下的所有产品将需要重新分类。`)) {
    const index = data.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      data.value.splice(index, 1)
      // 显示成功消息
      showMessage('删除成功', 'success')
    }
  }
}

function toggleStatus(row) {
  const newStatus = row.status === '正常' ? '停用' : '正常'
  const action = newStatus === '正常' ? '启用' : '停用'
  
  if (confirm(`确定要${action}分类"${row.name}"吗？`)) {
    row.status = newStatus
    showMessage(`${action}成功`, 'success')
  }
}

function handleSelectionChange(newSelection) {
  selectedRows.value = newSelection
}

function batchDelete() {
  if (selectedRows.value.length === 0) return
  
  if (confirm(`确定要删除选中的 ${selectedRows.value.length} 个分类吗？`)) {
    data.value = data.value.filter(item => !selectedRows.value.includes(item.id))
    selectedRows.value = []
    showMessage('批量删除成功', 'success')
  }
}

function validateForm() {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = '分类名称不能为空'
  }
  
  if (!form.value.code.trim()) {
    errors.value.code = '分类编码不能为空'
  } else {
    // 检查编码是否重复
    const exists = data.value.some(item => 
      item.code === form.value.code && item.id !== form.value.id
    )
    if (exists) {
      errors.value.code = '分类编码已存在'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  submitLoading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEditing.value) {
      // 编辑
      const index = data.value.findIndex(item => item.id === form.value.id)
      if (index > -1) {
        data.value[index] = { 
          ...form.value,
          updatedAt: new Date().toLocaleString()
        }
      }
      showMessage('编辑成功', 'success')
    } else {
      // 新增
      const newId = Math.max(...data.value.map(item => item.id)) + 1
      data.value.push({ 
        ...form.value, 
        id: newId,
        productCount: 0,
        createdAt: new Date().toLocaleString()
      })
      showMessage('添加成功', 'success')
    }
    
    closeDialog()
  } catch (error) {
    showMessage('操作失败，请重试', 'error')
  } finally {
    submitLoading.value = false
  }
}

function closeDialog() {
  dialogVisible.value = false
  form.value = {
    name: '',
    code: '',
    parentId: '',
    status: '正常',
    sort: 0,
    remark: ''
  }
  errors.value = {}
}

function handlePageChange(page) {
  currentPage.value = page
}

function handleSortChange(sortInfo) {
  console.log('排序变化:', sortInfo)
  // TODO: 实现排序逻辑
}

function exportData() {
  // TODO: 实现数据导出
  showMessage('导出功能开发中...', 'info')
}

function getStatusClass(status) {
  return status === '正常' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

function getStatusDotClass(status) {
  return status === '正常' ? 'bg-green-400' : 'bg-red-400'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function showMessage(message, type = 'info') {
  // TODO: 实现消息提示组件
  console.log(`${type}: ${message}`)
}

// 生命周期
onMounted(() => {
  // 初始化数据加载
})

// 监听搜索变化，重置分页
watch(() => filters.value.search, () => {
  currentPage.value = 1
})
</script> 

<template>
  <div class="audit-list">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold">待审核数据列表</h3>
      <div class="flex gap-2">
        <button @click="batchApprove" :disabled="selectedItems.length === 0" 
                class="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50">
          批量通过
        </button>
        <button @click="batchReject" :disabled="selectedItems.length === 0"
                class="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50">
          批量拒绝
        </button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="bg-gray-50 p-4 rounded-lg mb-4">
      <div class="grid grid-cols-4 gap-4">
        <select v-model="filters.status" class="border rounded px-3 py-2">
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
        <select v-model="filters.type" class="border rounded px-3 py-2">
          <option value="">全部类型</option>
          <option value="product">产品信息</option>
          <option value="trace">溯源数据</option>
          <option value="supplier">供应商</option>
        </select>
        <input v-model="filters.keyword" placeholder="搜索关键词" 
               class="border rounded px-3 py-2">
        <button @click="loadAuditList" class="bg-blue-500 text-white px-4 py-2 rounded">
          搜索
        </button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">
              <input type="checkbox" @change="selectAll" v-model="allSelected">
            </th>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">类型</th>
            <th class="px-4 py-3 text-left">标题</th>
            <th class="px-4 py-3 text-left">提交人</th>
            <th class="px-4 py-3 text-left">提交时间</th>
            <th class="px-4 py-3 text-left">状态</th>
            <th class="px-4 py-3 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in auditList" :key="item.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3">
              <input type="checkbox" :value="item.id" v-model="selectedItems">
            </td>
            <td class="px-4 py-3">{{ item.id }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {{ getTypeLabel(item.type) }}
              </span>
            </td>
            <td class="px-4 py-3">{{ item.title }}</td>
            <td class="px-4 py-3">{{ item.submitter }}</td>
            <td class="px-4 py-3">{{ formatDate(item.submitTime) }}</td>
            <td class="px-4 py-3">
              <span :class="getStatusClass(item.status)">
                {{ getStatusLabel(item.status) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="viewDetail(item)" 
                        class="text-blue-600 hover:text-blue-800">
                  查看
                </button>
                <button v-if="item.status === 'pending'" @click="approve(item)" 
                        class="text-green-600 hover:text-green-800">
                  通过
                </button>
                <button v-if="item.status === 'pending'" @click="reject(item)" 
                        class="text-red-600 hover:text-red-800">
                  拒绝
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-600">
        共 {{ total }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage <= 1" 
                class="px-3 py-1 border rounded disabled:opacity-50">
          上一页
        </button>
        <button @click="nextPage" :disabled="currentPage >= totalPages" 
                class="px-3 py-1 border rounded disabled:opacity-50">
          下一页
        </button>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-semibold">审核详情</h4>
          <button @click="showDetail = false" class="text-gray-500 hover:text-gray-700">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div v-if="selectedItem">
          <div class="space-y-4">
            <div><strong>ID:</strong> {{ selectedItem.id }}</div>
            <div><strong>类型:</strong> {{ getTypeLabel(selectedItem.type) }}</div>
            <div><strong>标题:</strong> {{ selectedItem.title }}</div>
            <div><strong>内容:</strong> {{ selectedItem.content }}</div>
            <div><strong>提交人:</strong> {{ selectedItem.submitter }}</div>
            <div><strong>提交时间:</strong> {{ formatDate(selectedItem.submitTime) }}</div>
          </div>
          <div class="flex justify-end gap-2 mt-6" v-if="selectedItem.status === 'pending'">
            <button @click="approve(selectedItem)" 
                    class="px-4 py-2 bg-green-500 text-white rounded">
              通过
            </button>
            <button @click="reject(selectedItem)" 
                    class="px-4 py-2 bg-red-500 text-white rounded">
              拒绝
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

const auditList = ref([])
const selectedItems = ref([])
const showDetail = ref(false)
const selectedItem = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filters = reactive({
  status: '',
  type: '',
  keyword: ''
})

const allSelected = computed({
  get: () => selectedItems.value.length === auditList.value.length && auditList.value.length > 0,
  set: (value) => {
    selectedItems.value = value ? auditList.value.map(item => item.id) : []
  }
})

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

onMounted(() => {
  loadAuditList()
})

async function loadAuditList() {
  // 模拟数据
  const mockData = [
    {
      id: 'A001',
      type: 'product',
      title: '有机苹果产品信息',
      content: '新增有机苹果产品信息，包含种植、加工等详细数据',
      submitter: '张农户',
      submitTime: new Date('2024-01-15'),
      status: 'pending'
    },
    {
      id: 'A002',
      type: 'trace',
      title: '溯源链路数据更新',
      content: '更新产品T001的物流环节数据',
      submitter: '李物流',
      submitTime: new Date('2024-01-14'),
      status: 'approved'
    }
  ]
  
  auditList.value = mockData
  total.value = mockData.length
}

function getTypeLabel(type) {
  const labels = {
    product: '产品信息',
    trace: '溯源数据',
    supplier: '供应商'
  }
  return labels[type] || type
}

function getStatusLabel(status) {
  const labels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return labels[status] || status
}

function getStatusClass(status) {
  const classes = {
    pending: 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    approved: 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    rejected: 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || ''
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN')
}

function viewDetail(item) {
  selectedItem.value = item
  showDetail.value = true
}

async function approve(item) {
  // TODO: 调用审核通过API
  item.status = 'approved'
  showDetail.value = false
}

async function reject(item) {
  // TODO: 调用审核拒绝API
  item.status = 'rejected'
  showDetail.value = false
}

async function batchApprove() {
  // TODO: 批量审核通过
  selectedItems.value = []
}

async function batchReject() {
  // TODO: 批量审核拒绝
  selectedItems.value = []
}

function selectAll(event) {
  allSelected.value = event.target.checked
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadAuditList()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadAuditList()
  }
}
</script> 

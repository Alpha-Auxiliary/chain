<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
      <!-- 头部 -->
      <div class="flex items-center justify-between pb-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">农户详细信息</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- 内容 -->
      <div class="mt-6 space-y-6">
        <!-- 基本信息 -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">基本信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">农户姓名</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">联系电话</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">身份证号</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.idCard || '未填写' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">认证状态</label>
              <span class="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(farmer.status)">
                {{ getStatusLabel(farmer.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 农场信息 -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">农场信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">农场名称</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.farmName || '未填写' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">农场面积</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.farmArea }}亩</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">农场地址</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.farmAddress || '未填写' }}</p>
            </div>
          </div>
        </div>

        <!-- 产品信息 -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">产品信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">产品名称</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.productName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">产品分类</label>
              <p class="mt-1 text-sm text-gray-900">{{ getCategoryLabel(farmer.category) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">品种</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.variety || '未填写' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">预期产量</label>
              <p class="mt-1 text-sm text-gray-900">{{ farmer.expectedYield || '未填写' }}kg</p>
            </div>
          </div>
        </div>

        <!-- 注册信息 -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">注册信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">注册时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(farmer.createdAt) }}</p>
            </div>
            <div v-if="farmer.auditTime">
              <label class="block text-sm font-medium text-gray-700">审核时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(farmer.auditTime) }}</p>
            </div>
          </div>
          <div v-if="farmer.auditRemark" class="mt-4">
            <label class="block text-sm font-medium text-gray-700">审核备注</label>
            <p class="mt-1 text-sm text-gray-900">{{ farmer.auditRemark }}</p>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          关闭
        </button>
        <button
          @click="editFarmer"
          class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
        >
          编辑信息
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  farmer: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}

function editFarmer() {
  // 跳转到编辑页面
  closeModal()
  // 这里可以触发编辑事件或路由跳转
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

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>
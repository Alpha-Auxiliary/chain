<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
      <!-- 头部 -->
      <div class="flex items-center justify-between pb-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">农户审核</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- 农户信息概览 -->
      <div class="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 class="text-md font-medium text-gray-900 mb-3">待审核农户信息</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">农户姓名：</span>
            <span class="text-gray-900">{{ farmer.name }}</span>
          </div>
          <div>
            <span class="text-gray-600">联系电话：</span>
            <span class="text-gray-900">{{ farmer.phone }}</span>
          </div>
          <div>
            <span class="text-gray-600">产品名称：</span>
            <span class="text-gray-900">{{ farmer.productName }}</span>
          </div>
          <div>
            <span class="text-gray-600">农场面积：</span>
            <span class="text-gray-900">{{ farmer.farmArea }}亩</span>
          </div>
        </div>
      </div>

      <!-- 审核表单 -->
      <form @submit.prevent="submitAudit" class="mt-6 space-y-6">
        <!-- 审核结果 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">审核结果</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="auditForm.status"
                type="radio"
                value="certified"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-900">通过审核</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="auditForm.status"
                type="radio"
                value="rejected"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-900">拒绝审核</span>
            </label>
          </div>
        </div>

        <!-- 审核项目 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">审核项目</label>
          <div class="space-y-3">
            <div v-for="item in auditItems" :key="item.key" class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span class="text-sm font-medium text-gray-900">{{ item.label }}</span>
                <p class="text-xs text-gray-500">{{ item.description }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <label class="flex items-center">
                  <input
                    v-model="auditForm.items[item.key]"
                    type="radio"
                    :value="true"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span class="ml-1 text-sm text-green-600">通过</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="auditForm.items[item.key]"
                    type="radio"
                    :value="false"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span class="ml-1 text-sm text-red-600">不通过</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 审核备注 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">审核备注</label>
          <textarea
            v-model="auditForm.remark"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="请填写审核意见和建议..."
          ></textarea>
        </div>

        <!-- 审核人信息 -->
        <div class="bg-blue-50 rounded-lg p-4">
          <h5 class="text-sm font-medium text-blue-900 mb-2">审核人信息</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-blue-700">审核人：</span>
              <span class="text-blue-900">{{ currentUser.name }}</span>
            </div>
            <div>
              <span class="text-blue-700">审核时间：</span>
              <span class="text-blue-900">{{ formatDate(new Date()) }}</span>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交审核
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  farmer: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const auditForm = ref({
  status: '',
  items: {
    basicInfo: null,
    farmInfo: null,
    productInfo: null,
    documents: null
  },
  remark: ''
})

const auditItems = ref([
  {
    key: 'basicInfo',
    label: '基本信息',
    description: '农户姓名、联系方式、身份证等信息是否真实有效'
  },
  {
    key: 'farmInfo',
    label: '农场信息',
    description: '农场名称、地址、面积等信息是否准确'
  },
  {
    key: 'productInfo',
    label: '产品信息',
    description: '产品名称、分类、品种等信息是否完整'
  },
  {
    key: 'documents',
    label: '相关证件',
    description: '营业执照、认证证书等文件是否齐全'
  }
])

const currentUser = ref({
  name: '管理员',
  id: 'admin001'
})

const canSubmit = computed(() => {
  return auditForm.value.status && 
         Object.values(auditForm.value.items).every(item => item !== null) &&
         auditForm.value.remark.trim()
})

function closeModal() {
  emit('close')
}

function submitAudit() {
  if (!canSubmit.value) return

  const result = {
    status: auditForm.value.status,
    items: auditForm.value.items,
    remark: auditForm.value.remark,
    auditor: currentUser.value.name,
    auditTime: new Date().toISOString()
  }

  emit('submit', result)
}

function formatDate(date) {
  return date.toLocaleString('zh-CN')
}
</script>
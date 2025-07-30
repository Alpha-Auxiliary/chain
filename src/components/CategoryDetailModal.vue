<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
      <!-- 头部 -->
      <div class="flex items-center justify-between pb-4 border-b">
        <h3 class="text-lg font-medium text-gray-900 flex items-center">
          <ArchiveBoxIcon class="h-5 w-5 text-green-600 mr-2" />
          分类详情
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div v-if="category" class="mt-6 space-y-6">
        <!-- 基本信息 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-4 flex items-center">
            <InformationCircleIcon class="h-5 w-5 text-blue-600 mr-2" />
            基本信息
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">分类名称</label>
              <p class="mt-1 text-sm text-gray-900">{{ category.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">分类编码</label>
              <p class="mt-1 text-sm text-gray-900">{{ category.code }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">上级分类</label>
              <p class="mt-1 text-sm text-gray-900">{{ getParentName(category.parentId) || '无' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">状态</label>
              <span class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(category.status)">
                <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(category.status)"></span>
                {{ category.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">排序</label>
              <p class="mt-1 text-sm text-gray-900">{{ category.sort }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">产品数量</label>
              <p class="mt-1 text-sm text-gray-900">{{ category.productCount || 0 }} 个</p>
            </div>
          </div>
          <div v-if="category.remark" class="mt-4">
            <label class="block text-sm font-medium text-gray-700">备注</label>
            <p class="mt-1 text-sm text-gray-900">{{ category.remark }}</p>
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-4 flex items-center">
            <ClockIcon class="h-5 w-5 text-blue-600 mr-2" />
            时间信息
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">创建时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(category.createdAt) }}</p>
            </div>
            <div v-if="category.updatedAt">
              <label class="block text-sm font-medium text-gray-700">更新时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(category.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <!-- 子分类 -->
        <div v-if="subCategories.length > 0" class="bg-green-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-4 flex items-center">
            <FolderIcon class="h-5 w-5 text-green-600 mr-2" />
            子分类 ({{ subCategories.length }})
          </h4>
          <div class="space-y-2">
            <div v-for="sub in subCategories" :key="sub.id" 
                 class="flex items-center justify-between p-2 bg-white rounded border">
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{ sub.name }}</span>
                <span class="ml-2 text-xs text-gray-500">({{ sub.code }})</span>
              </div>
              <span class="text-xs text-gray-500">{{ sub.productCount || 0 }} 个产品</span>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="bg-purple-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon class="h-5 w-5 text-purple-600 mr-2" />
            统计信息
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">{{ category.productCount || 0 }}</p>
              <p class="text-sm text-gray-600">直属产品</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ subCategories.length }}</p>
              <p class="text-sm text-gray-600">子分类</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ totalProducts }}</p>
              <p class="text-sm text-gray-600">总产品数</p>
            </div>
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
          @click="editCategory"
          class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
        >
          编辑分类
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  XMarkIcon, 
  ArchiveBoxIcon, 
  InformationCircleIcon,
  ClockIcon,
  FolderIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  category: {
    type: Object,
    default: null
  },
  allCategories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'edit'])

const subCategories = computed(() => {
  if (!props.category) return []
  return props.allCategories.filter(cat => cat.parentId === props.category.id)
})

const totalProducts = computed(() => {
  if (!props.category) return 0
  const directProducts = props.category.productCount || 0
  const subProducts = subCategories.value.reduce((sum, sub) => sum + (sub.productCount || 0), 0)
  return directProducts + subProducts
})

function closeModal() {
  emit('close')
}

function editCategory() {
  emit('edit', props.category)
}

function getParentName(parentId) {
  if (!parentId) return null
  const parent = props.allCategories.find(cat => cat.id === parentId)
  return parent ? parent.name : null
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
</script>
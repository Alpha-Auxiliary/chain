<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <PlusIcon class="h-8 w-8 text-green-600 mr-3" />
            添加产品分类
          </h1>
          <p class="text-gray-600 mt-1">创建新的农产品分类，支持层级分类和状态控制</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="goBack"
            class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            返回列表
          </button>
        </div>
      </div>
    </div>

    <!-- 表单卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 基本信息 -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TagIcon class="h-5 w-5 text-blue-600 mr-2" />
            基本信息
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                分类名称 <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.name" 
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="请输入分类编码" 
              />
              <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>
              <p class="mt-1 text-xs text-gray-500">编码用于系统内部识别，建议使用英文字母和数字</p>
            </div>
          </div>
        </div>

        <!-- 分类设置 -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AdjustmentsHorizontalIcon class="h-5 w-5 text-purple-600 mr-2" />
            分类设置
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">上级分类</label>
              <select 
                v-model="form.parentId" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">无上级分类（顶级分类）</option>
                <option v-for="category in parentCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">选择上级分类可创建多层级分类结构</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select 
                v-model="form.status" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="正常">正常</option>
                <option value="停用">停用</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">停用状态的分类不会在前台显示</p>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">排序</label>
            <input 
              v-model.number="form.sort" 
              type="number"
              min="0"
              max="9999"
              class="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              placeholder="数字越小排序越靠前" 
            />
            <p class="mt-1 text-xs text-gray-500">用于控制分类在列表中的显示顺序</p>
          </div>
        </div>

        <!-- 附加信息 -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon class="h-5 w-5 text-orange-600 mr-2" />
            附加信息
          </h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea 
              v-model="form.remark" 
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              placeholder="请输入备注信息，如分类说明、使用范围等" 
            ></textarea>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="border-t pt-6">
          <div class="flex items-center justify-end space-x-4">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              重置表单
            </button>
            <button
              type="button"
              @click="saveDraft"
              :disabled="loading"
              class="px-6 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <BookmarkIcon class="h-4 w-4 mr-2 inline" />
              保存草稿
            </button>
            <button
              type="submit"
              :disabled="loading || !canSubmit"
              class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? '提交中...' : '创建分类' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- 预览卡片 -->
    <div v-if="form.name" class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <EyeIcon class="h-5 w-5 text-green-600 mr-2" />
        分类预览
      </h3>
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-12 w-12">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span class="text-white font-medium">{{ form.name.charAt(0) }}</span>
            </div>
          </div>
          <div class="ml-4 flex-1">
            <div class="flex items-center">
              <h4 class="text-lg font-medium text-gray-900">{{ form.name }}</h4>
              <span 
                class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="form.status === '正常' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ form.status }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              编码: {{ form.code || '未设置' }} 
              <span v-if="form.parentId" class="ml-2">
                | 上级: {{ getParentName(form.parentId) }}
              </span>
              <span v-if="form.sort" class="ml-2">
                | 排序: {{ form.sort }}
              </span>
            </p>
            <p v-if="form.remark" class="text-sm text-gray-600 mt-2">{{ form.remark }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  PlusIcon, 
  ArrowLeftIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  BookmarkIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 响应式数据
const loading = ref(false)

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

// 模拟父级分类数据
const parentCategories = ref([
  { id: 1, name: '水果类' },
  { id: 2, name: '蔬菜类' },
  { id: 3, name: '粮食类' },
  { id: 4, name: '肉类' },
  { id: 5, name: '水产类' }
])

// 计算属性
const canSubmit = computed(() => {
  return form.value.name.trim() && form.value.code.trim() && Object.keys(errors.value).length === 0
})

// 方法
function validateForm() {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = '分类名称不能为空'
  } else if (form.value.name.length > 50) {
    errors.value.name = '分类名称不能超过50个字符'
  }
  
  if (!form.value.code.trim()) {
    errors.value.code = '分类编码不能为空'
  } else if (!/^[A-Za-z0-9_-]+$/.test(form.value.code)) {
    errors.value.code = '分类编码只能包含字母、数字、下划线和横线'
  } else if (form.value.code.length > 20) {
    errors.value.code = '分类编码不能超过20个字符'
  }
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟成功
    showMessage('分类创建成功！', 'success')
    
    // 跳转到列表页
    setTimeout(() => {
      router.push('/product-category')
    }, 1000)
    
  } catch (error) {
    console.error('创建分类失败:', error)
    showMessage('创建失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}

function resetForm() {
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

async function saveDraft() {
  if (!form.value.name.trim()) {
    showMessage('请至少填写分类名称', 'warning')
    return
  }
  
  try {
    // 模拟保存草稿
    await new Promise(resolve => setTimeout(resolve, 1000))
    showMessage('草稿保存成功', 'success')
  } catch (error) {
    showMessage('保存草稿失败', 'error')
  }
}

function goBack() {
  if (hasFormData()) {
    if (confirm('表单有未保存的内容，确定要离开吗？')) {
      router.push('/product-category')
    }
  } else {
    router.push('/product-category')
  }
}

function hasFormData() {
  return form.value.name || form.value.code || form.value.remark
}

function getParentName(parentId) {
  const parent = parentCategories.value.find(cat => cat.id === parentId)
  return parent ? parent.name : ''
}

function showMessage(message, type = 'info') {
  // TODO: 实现消息提示组件
  console.log(`${type}: ${message}`)
  alert(message)
}

// 生命周期
onMounted(() => {
  // 可以在这里加载父级分类数据
  loadParentCategories()
})

async function loadParentCategories() {
  try {
    // 模拟加载父级分类
    // const response = await api.getCategories()
    // parentCategories.value = response.data
  } catch (error) {
    console.error('加载父级分类失败:', error)
  }
}
</script> 

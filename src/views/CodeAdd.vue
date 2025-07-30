<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <QrCodeIcon class="h-8 w-8 text-green-600 mr-3" />
            溯源码生成管理
          </h1>
          <p class="text-gray-500 mt-1">批量生成溯源码，支持多种格式和配置选项</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="text-right">
            <p class="text-sm text-gray-500">今日已生成</p>
            <p class="text-2xl font-bold text-green-600">{{ todayGenerated }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 生成表单 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 配置表单 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <CogIcon class="h-5 w-5 text-blue-600 mr-2" />
            生成配置
          </h2>
          
          <form @submit.prevent="generateCodes" class="space-y-6">
            <!-- 基础配置 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  生成数量 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.quantity"
                  type="number"
                  min="1"
                  max="10000"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="请输入生成数量"
                />
                <p class="text-xs text-gray-500 mt-1">单次最多生成10,000个</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  码类型 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.codeType"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">请选择码类型</option>
                  <option value="product">产品码</option>
                  <option value="batch">批次码</option>
                  <option value="package">包装码</option>
                  <option value="logistics">物流码</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  关联产品分类
                </label>
                <select
                  v-model="form.categoryId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">请选择产品分类</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  有效期（天）
                </label>
                <input
                  v-model.number="form.validDays"
                  type="number"
                  min="1"
                  max="3650"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="默认365天"
                />
              </div>
            </div>

            <!-- 高级配置 -->
            <div class="border-t pt-6">
              <h3 class="text-md font-medium text-gray-900 mb-4 flex items-center">
                <AdjustmentsHorizontalIcon class="h-5 w-5 text-purple-600 mr-2" />
                高级配置
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    前缀设置
                  </label>
                  <input
                    v-model="form.prefix"
                    type="text"
                    maxlength="10"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="如：SN、TR等"
                  />
                  <p class="text-xs text-gray-500 mt-1">最多10个字符</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    码长度
                  </label>
                  <select
                    v-model="form.codeLength"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="8">8位</option>
                    <option value="12">12位</option>
                    <option value="16">16位</option>
                    <option value="20">20位</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    包含字符类型
                  </label>
                  <div class="flex flex-wrap gap-4">
                    <label class="flex items-center">
                      <input
                        v-model="form.includeNumbers"
                        type="checkbox"
                        class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span class="ml-2 text-sm text-gray-700">数字 (0-9)</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.includeUppercase"
                        type="checkbox"
                        class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span class="ml-2 text-sm text-gray-700">大写字母 (A-Z)</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.includeLowercase"
                        type="checkbox"
                        class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span class="ml-2 text-sm text-gray-700">小写字母 (a-z)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 备注信息 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                备注信息
              </label>
              <textarea
                v-model="form.remark"
                rows="3"
                maxlength="200"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入备注信息（可选）"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ form.remark.length }}/200</p>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                重置
              </button>
              <button
                type="button"
                @click="previewCodes"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                :disabled="!canPreview"
              >
                预览
              </button>
              <button
                type="submit"
                class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                :disabled="loading || !canGenerate"
              >
                <SparklesIcon v-if="!loading" class="h-5 w-5 mr-2" />
                <ArrowPathIcon v-else class="h-5 w-5 mr-2 animate-spin" />
                {{ loading ? '生成中...' : '生成溯源码' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 预览和统计 -->
      <div class="space-y-6">
        <!-- 预览示例 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <EyeIcon class="h-5 w-5 text-green-600 mr-2" />
            预览示例
          </h3>
          
          <div v-if="previewCode" class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-mono font-bold text-gray-900 mb-2">
                {{ previewCode }}
              </div>
              <div class="w-32 h-32 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <QrCodeIcon class="h-16 w-16 text-gray-400" />
              </div>
              <p class="text-xs text-gray-500 mt-2">二维码预览</p>
            </div>
            
            <div class="text-sm text-gray-600 space-y-1">
              <p><span class="font-medium">类型:</span> {{ getCodeTypeLabel(form.codeType) }}</p>
              <p><span class="font-medium">长度:</span> {{ form.codeLength }}位</p>
              <p><span class="font-medium">前缀:</span> {{ form.prefix || '无' }}</p>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <QrCodeIcon class="h-16 w-16 text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500">点击预览按钮查看示例</p>
          </div>
        </div>

        <!-- 生成统计 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon class="h-5 w-5 text-blue-600 mr-2" />
            生成统计
          </h3>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-gray-700">今日生成</span>
              <span class="font-bold text-blue-600">{{ todayGenerated }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span class="text-sm text-gray-700">本月生成</span>
              <span class="font-bold text-green-600">{{ monthGenerated }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span class="text-sm text-gray-700">总计生成</span>
              <span class="font-bold text-purple-600">{{ totalGenerated }}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span class="text-sm text-gray-700">已使用</span>
              <span class="font-bold text-yellow-600">{{ usedCodes }}</span>
            </div>
          </div>
        </div>

        <!-- 最近生成记录 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClockIcon class="h-5 w-5 text-orange-600 mr-2" />
            最近生成
          </h3>
          
          <div class="space-y-3">
            <div v-for="record in recentRecords" :key="record.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ record.quantity }}个 {{ getCodeTypeLabel(record.type) }}</p>
                <p class="text-xs text-gray-500">{{ record.time }}</p>
              </div>
              <span class="px-2 py-1 text-xs rounded-full"
                    :class="record.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ record.status === 'success' ? '成功' : '失败' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 生成结果弹窗 -->
    <div v-if="showResult" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600 mr-2" />
              生成完成
            </h3>
            <button @click="closeResult" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-96">
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ generatedCodes.length }}</div>
            <p class="text-gray-600">个溯源码生成成功</p>
          </div>
          
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="(code, index) in generatedCodes" :key="index"
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-mono text-sm">{{ code }}</span>
              <button @click="copyCode(code)" 
                      class="text-blue-600 hover:text-blue-800 text-sm">
                复制
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t bg-gray-50 flex justify-end space-x-4">
          <button @click="exportCodes" 
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            导出Excel
          </button>
          <button @click="closeResult" 
                  class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  QrCodeIcon,
  CogIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// 响应式数据
const loading = ref(false)
const showResult = ref(false)
const previewCode = ref('')
const generatedCodes = ref([])

const form = ref({
  quantity: 100,
  codeType: '',
  categoryId: '',
  validDays: 365,
  prefix: '',
  codeLength: 12,
  includeNumbers: true,
  includeUppercase: true,
  includeLowercase: false,
  remark: ''
})

const categories = ref([
  { id: 1, name: '水果类' },
  { id: 2, name: '蔬菜类' },
  { id: 3, name: '粮食类' },
  { id: 4, name: '肉类' },
  { id: 5, name: '水产类' }
])

const todayGenerated = ref(1234)
const monthGenerated = ref(15678)
const totalGenerated = ref(123456)
const usedCodes = ref(98765)

const recentRecords = ref([
  { id: 1, quantity: 500, type: 'product', time: '2小时前', status: 'success' },
  { id: 2, quantity: 200, type: 'batch', time: '4小时前', status: 'success' },
  { id: 3, quantity: 100, type: 'package', time: '6小时前', status: 'failed' },
  { id: 4, quantity: 300, type: 'logistics', time: '8小时前', status: 'success' }
])

// 计算属性
const canPreview = computed(() => {
  return form.value.codeType && form.value.quantity > 0
})

const canGenerate = computed(() => {
  return form.value.codeType && 
         form.value.quantity > 0 && 
         form.value.quantity <= 10000 &&
         (form.value.includeNumbers || form.value.includeUppercase || form.value.includeLowercase)
})

// 生命周期
onMounted(() => {
  loadStatistics()
})

// 方法
function getCodeTypeLabel(type) {
  const labels = {
    product: '产品码',
    batch: '批次码',
    package: '包装码',
    logistics: '物流码'
  }
  return labels[type] || '未知类型'
}

function generateRandomCode() {
  let chars = ''
  if (form.value.includeNumbers) chars += '0123456789'
  if (form.value.includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (form.value.includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
  
  if (!chars) chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  let result = form.value.prefix || ''
  const remainingLength = form.value.codeLength - result.length
  
  for (let i = 0; i < remainingLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

function previewCodes() {
  if (!canPreview.value) return
  previewCode.value = generateRandomCode()
}

async function generateCodes() {
  if (!canGenerate.value) return
  
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成溯源码
    const codes = []
    for (let i = 0; i < form.value.quantity; i++) {
      codes.push(generateRandomCode())
    }
    
    generatedCodes.value = codes
    showResult.value = true
    
    // 更新统计
    todayGenerated.value += form.value.quantity
    monthGenerated.value += form.value.quantity
    totalGenerated.value += form.value.quantity
    
    // 添加到最近记录
    recentRecords.value.unshift({
      id: Date.now(),
      quantity: form.value.quantity,
      type: form.value.codeType,
      time: '刚刚',
      status: 'success'
    })
    
    if (recentRecords.value.length > 10) {
      recentRecords.value = recentRecords.value.slice(0, 10)
    }
    
  } catch (error) {
    console.error('生成溯源码失败:', error)
    alert('生成失败，请重试')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    quantity: 100,
    codeType: '',
    categoryId: '',
    validDays: 365,
    prefix: '',
    codeLength: 12,
    includeNumbers: true,
    includeUppercase: true,
    includeLowercase: false,
    remark: ''
  }
  previewCode.value = ''
}

function closeResult() {
  showResult.value = false
  generatedCodes.value = []
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert('已复制到剪贴板')
  }).catch(() => {
    alert('复制失败')
  })
}

function exportCodes() {
  // 模拟导出Excel
  const csvContent = generatedCodes.value.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `溯源码_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

function loadStatistics() {
  // 模拟加载统计数据
  todayGenerated.value = Math.floor(Math.random() * 2000) + 500
  monthGenerated.value = Math.floor(Math.random() * 20000) + 10000
  totalGenerated.value = Math.floor(Math.random() * 200000) + 100000
  usedCodes.value = Math.floor(totalGenerated.value * 0.8)
}
</script> 

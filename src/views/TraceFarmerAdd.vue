<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <UserPlusIcon class="h-8 w-8 text-green-600 mr-3" />
            农户数据录入
          </h1>
          <p class="text-gray-500 mt-1">录入农产品生产全流程数据，建立完整溯源链条</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="text-right">
            <p class="text-sm text-gray-500">今日录入</p>
            <p class="text-2xl font-bold text-green-600">{{ todayEntries }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤表单 -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- 步骤指示器 -->
      <div class="px-6 py-4 bg-gray-50 border-b">
        <div class="flex items-center justify-between">
          <div v-for="(step, index) in steps" :key="index" 
               class="flex items-center"
               :class="{ 'flex-1': index < steps.length - 1 }">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300"
                   :class="getStepClass(index)">
                <component :is="step.icon" class="h-5 w-5" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium" :class="currentStep >= index ? 'text-gray-900' : 'text-gray-500'">
                  {{ step.title }}
                </p>
                <p class="text-xs text-gray-500">{{ step.description }}</p>
              </div>
            </div>
            <div v-if="index < steps.length - 1" 
                 class="flex-1 h-0.5 mx-4 transition-all duration-300"
                 :class="currentStep > index ? 'bg-green-500' : 'bg-gray-200'">
            </div>
          </div>
        </div>
      </div>

      <!-- 表单内容 -->
      <div class="p-6">
        <!-- 步骤1: 基本信息 -->
        <div v-if="currentStep === 0" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                农户姓名 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.farmerName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入农户姓名"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                联系电话 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入联系电话"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                身份证号 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.idCard"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入身份证号"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                农场名称
              </label>
              <input
                v-model="formData.farmName"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入农场名称"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                农场地址 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.farmAddress"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入详细地址"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                种植面积（亩）
              </label>
              <input
                v-model.number="formData.farmArea"
                type="number"
                min="0"
                step="0.1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入种植面积"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                认证类型
              </label>
              <select
                v-model="formData.certificationType"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">请选择认证类型</option>
                <option value="organic">有机认证</option>
                <option value="green">绿色食品</option>
                <option value="pollution-free">无公害农产品</option>
                <option value="gap">GAP认证</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 步骤2: 产品信息 -->
        <div v-if="currentStep === 1" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">产品信息</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                产品名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.productName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入产品名称"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                产品分类 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.productCategory"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">请选择产品分类</option>
                <option value="fruit">水果类</option>
                <option value="vegetable">蔬菜类</option>
                <option value="grain">粮食类</option>
                <option value="meat">肉类</option>
                <option value="aquatic">水产类</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                品种
              </label>
              <input
                v-model="formData.variety"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入具体品种"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                预计产量（kg）
              </label>
              <input
                v-model.number="formData.expectedYield"
                type="number"
                min="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入预计产量"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                种植季节
              </label>
              <select
                v-model="formData.season"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">请选择种植季节</option>
                <option value="spring">春季</option>
                <option value="summer">夏季</option>
                <option value="autumn">秋季</option>
                <option value="winter">冬季</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                种植方式
              </label>
              <select
                v-model="formData.plantingMethod"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">请选择种植方式</option>
                <option value="outdoor">露天种植</option>
                <option value="greenhouse">大棚种植</option>
                <option value="hydroponic">水培种植</option>
                <option value="organic">有机种植</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 步骤3: 生产过程 -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">生产过程记录</h3>
            <button
              @click="addProductionRecord"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              添加记录
            </button>
          </div>

          <div v-if="formData.productionRecords.length === 0" class="text-center py-8">
            <DocumentPlusIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">暂无生产记录，点击上方按钮添加</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(record, index) in formData.productionRecords" :key="index"
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium text-gray-900">记录 {{ index + 1 }}</h4>
                <button
                  @click="removeProductionRecord(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    操作类型 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="record.type"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="planting">播种</option>
                    <option value="fertilizing">施肥</option>
                    <option value="watering">浇水</option>
                    <option value="pesticide">施药</option>
                    <option value="weeding">除草</option>
                    <option value="harvesting">收获</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    操作日期 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="record.date"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    操作人员
                  </label>
                  <input
                    v-model="record.operator"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="操作人员姓名"
                  />
                </div>

                <div class="md:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    详细描述
                  </label>
                  <textarea
                    v-model="record.description"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="请描述具体操作内容、使用的材料等"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤4: 质量检测 -->
        <div v-if="currentStep === 3" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">质量检测</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                检测机构
              </label>
              <input
                v-model="formData.testingAgency"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入检测机构名称"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                检测日期
              </label>
              <input
                v-model="formData.testingDate"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                检测报告编号
              </label>
              <input
                v-model="formData.testingReportNo"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入检测报告编号"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                检测结果
              </label>
              <select
                v-model="formData.testingResult"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">请选择检测结果</option>
                <option value="qualified">合格</option>
                <option value="unqualified">不合格</option>
                <option value="pending">待检测</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                检测项目
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label v-for="item in testingItems" :key="item.value" class="flex items-center">
                  <input
                    v-model="formData.testingItems"
                    :value="item.value"
                    type="checkbox"
                    class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ item.label }}</span>
                </label>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                检测备注
              </label>
              <textarea
                v-model="formData.testingRemark"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="请输入检测相关备注信息"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 步骤5: 确认提交 -->
        <div v-if="currentStep === 4" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">确认信息</h3>
          
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-500">农户姓名:</span>
                <span class="ml-2 text-gray-900">{{ formData.farmerName }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">联系电话:</span>
                <span class="ml-2 text-gray-900">{{ formData.phone }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">产品名称:</span>
                <span class="ml-2 text-gray-900">{{ formData.productName }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">产品分类:</span>
                <span class="ml-2 text-gray-900">{{ getCategoryLabel(formData.productCategory) }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">农场地址:</span>
                <span class="ml-2 text-gray-900">{{ formData.farmAddress }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">生产记录:</span>
                <span class="ml-2 text-gray-900">{{ formData.productionRecords.length }} 条</span>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex">
              <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <div>
                <h4 class="text-sm font-medium text-yellow-800">提交须知</h4>
                <p class="text-sm text-yellow-700 mt-1">
                  请仔细核对以上信息，提交后将进入审核流程。审核通过后，数据将上链存储，不可修改。
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-between pt-6 border-t">
          <button
            v-if="currentStep > 0"
            @click="prevStep"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <ChevronLeftIcon class="h-4 w-4 mr-2" />
            上一步
          </button>
          <div v-else></div>

          <div class="flex space-x-4">
            <button
              @click="saveDraft"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              保存草稿
            </button>
            
            <button
              v-if="currentStep < steps.length - 1"
              @click="nextStep"
              :disabled="!canProceed"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步
              <ChevronRightIcon class="h-4 w-4 ml-2" />
            </button>
            
            <button
              v-else
              @click="submitForm"
              :disabled="loading"
              class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              <CloudArrowUpIcon v-if="!loading" class="h-5 w-5 mr-2" />
              <ArrowPathIcon v-else class="h-5 w-5 mr-2 animate-spin" />
              {{ loading ? '提交中...' : '提交审核' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  UserPlusIcon,
  UserIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  BeakerIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentPlusIcon
} from '@heroicons/vue/24/outline'

// 响应式数据
const currentStep = ref(0)
const loading = ref(false)
const todayEntries = ref(12)

const steps = ref([
  { title: '基本信息', description: '农户基础信息', icon: UserIcon },
  { title: '产品信息', description: '产品详细信息', icon: ArchiveBoxIcon },
  { title: '生产过程', description: '生产记录', icon: DocumentTextIcon },
  { title: '质量检测', description: '检测信息', icon: BeakerIcon },
  { title: '确认提交', description: '核对信息', icon: CheckCircleIcon }
])

const formData = ref({
  // 基本信息
  farmerName: '',
  phone: '',
  idCard: '',
  farmName: '',
  farmAddress: '',
  farmArea: null,
  certificationType: '',
  
  // 产品信息
  productName: '',
  productCategory: '',
  variety: '',
  expectedYield: null,
  season: '',
  plantingMethod: '',
  
  // 生产过程
  productionRecords: [],
  
  // 质量检测
  testingAgency: '',
  testingDate: '',
  testingReportNo: '',
  testingResult: '',
  testingItems: [],
  testingRemark: ''
})

const testingItems = ref([
  { value: 'pesticide', label: '农药残留' },
  { value: 'heavy_metal', label: '重金属' },
  { value: 'microorganism', label: '微生物' },
  { value: 'nutrition', label: '营养成分' },
  { value: 'additive', label: '添加剂' },
  { value: 'gmo', label: '转基因' },
  { value: 'radioactive', label: '放射性' },
  { value: 'other', label: '其他' }
])

// 计算属性
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return formData.value.farmerName && formData.value.phone && formData.value.idCard && formData.value.farmAddress
    case 1:
      return formData.value.productName && formData.value.productCategory
    case 2:
      return true // 生产记录可选
    case 3:
      return true // 质量检测可选
    default:
      return true
  }
})

// 生命周期
onMounted(() => {
  loadTodayStats()
})

// 方法
function getStepClass(index) {
  if (currentStep.value > index) {
    return 'bg-green-500 border-green-500 text-white'
  } else if (currentStep.value === index) {
    return 'bg-green-100 border-green-500 text-green-600'
  } else {
    return 'bg-gray-100 border-gray-300 text-gray-400'
  }
}

function getCategoryLabel(category) {
  const labels = {
    fruit: '水果类',
    vegetable: '蔬菜类',
    grain: '粮食类',
    meat: '肉类',
    aquatic: '水产类'
  }
  return labels[category] || category
}

function nextStep() {
  if (canProceed.value && currentStep.value < steps.value.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function addProductionRecord() {
  formData.value.productionRecords.push({
    type: '',
    date: '',
    operator: '',
    description: ''
  })
}

function removeProductionRecord(index) {
  formData.value.productionRecords.splice(index, 1)
}

async function saveDraft() {
  try {
    // 模拟保存草稿
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('草稿保存成功')
  } catch (error) {
    console.error('保存草稿失败:', error)
    alert('保存失败，请重试')
  }
}

async function submitForm() {
  if (!canProceed.value) return
  
  loading.value = true
  
  try {
    // 模拟提交API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('提交成功！数据已进入审核流程')
    
    // 重置表单
    resetForm()
    currentStep.value = 0
    
    // 更新统计
    todayEntries.value++
    
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请重试')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  formData.value = {
    farmerName: '',
    phone: '',
    idCard: '',
    farmName: '',
    farmAddress: '',
    farmArea: null,
    certificationType: '',
    productName: '',
    productCategory: '',
    variety: '',
    expectedYield: null,
    season: '',
    plantingMethod: '',
    productionRecords: [],
    testingAgency: '',
    testingDate: '',
    testingReportNo: '',
    testingResult: '',
    testingItems: [],
    testingRemark: ''
  }
}

function loadTodayStats() {
  // 模拟加载今日统计
  todayEntries.value = Math.floor(Math.random() * 20) + 5
}
</script> 

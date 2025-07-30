<template>
  <div class="trace-result-page p-6 space-y-6">
    <!-- 页面头部 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <DocumentTextIcon class="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">溯源结果详情</h1>
            <p class="text-gray-500">查看产品完整溯源信息</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button 
            @click="goBack"
            class="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeftIcon class="h-4 w-4" />
            返回查询
          </button>
          <button 
            @click="refreshData"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
            <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loading }" />
            刷新数据
          </button>
        </div>
      </div>
    </div>

    <!-- 产品基本信息 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <img v-if="productInfo.image" :src="productInfo.image" :alt="productInfo.name" class="w-16 h-16 object-cover rounded-lg" />
              <CubeIcon v-else class="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ productInfo.name }}</h2>
              <div class="flex items-center gap-6 text-sm text-gray-600">
                <span class="flex items-center gap-1">
                  <MapPinIcon class="h-4 w-4" />
                  {{ productInfo.origin }}
                </span>
                <span class="flex items-center gap-1">
                  <CalendarIcon class="h-4 w-4" />
                  {{ productInfo.date }}
                </span>
                <span class="flex items-center gap-1">
                  <TagIcon class="h-4 w-4" />
                  {{ productInfo.category }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-2">
              <CheckCircleIcon class="h-4 w-4 mr-2" />
              {{ productInfo.status }}
            </div>
            <p class="text-sm text-gray-500">溯源码：{{ productInfo.code }}</p>
            <p class="text-sm text-gray-500">批次号：{{ productInfo.batchNo }}</p>
          </div>
        </div>
      </div>

      <!-- 产品详细信息 -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <ScaleIcon class="h-5 w-5 text-blue-600" />
              <h3 class="font-semibold text-gray-900">规格信息</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">净重量</span>
                <span class="font-medium">{{ productInfo.weight }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">包装规格</span>
                <span class="font-medium">{{ productInfo.package }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">保质期</span>
                <span class="font-medium">{{ productInfo.shelfLife }}</span>
              </div>
            </div>
          </div>

          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <ShieldCheckIcon class="h-5 w-5 text-green-600" />
              <h3 class="font-semibold text-gray-900">认证信息</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">有机认证</span>
                <span class="font-medium text-green-600">已认证</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">质量等级</span>
                <span class="font-medium">特级</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">安全等级</span>
                <span class="font-medium text-green-600">A级</span>
              </div>
            </div>
          </div>

          <div class="bg-purple-50 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <UserIcon class="h-5 w-5 text-purple-600" />
              <h3 class="font-semibold text-gray-900">生产信息</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">生产商</span>
                <span class="font-medium">{{ productInfo.producer }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">联系电话</span>
                <span class="font-medium">{{ productInfo.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">许可证号</span>
                <span class="font-medium">{{ productInfo.license }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 溯源时间线 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="font-bold text-xl mb-6 flex items-center text-gray-900">
        <ClockIcon class="h-6 w-6 text-green-600 mr-3" />
        溯源流程时间线
      </h3>
      
      <div class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-blue-500"></div>
        <div class="space-y-8">
          <div 
            v-for="(step, idx) in traceSteps" 
            :key="idx" 
            class="relative flex items-start group">
            <!-- 时间线节点 -->
            <div class="absolute left-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <component :is="step.icon" class="h-5 w-5 text-white" />
            </div>
            
            <!-- 内容卡片 -->
            <div class="ml-20 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 group-hover:shadow-md transition-all duration-200 hover:border-green-300">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="font-semibold text-lg text-gray-900 mb-1">{{ step.title }}</h4>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <CalendarIcon class="h-4 w-4" />
                      {{ step.date }}
                    </span>
                    <span class="flex items-center gap-1">
                      <ClockIcon class="h-4 w-4" />
                      {{ step.time }}
                    </span>
                    <span class="flex items-center gap-1">
                      <MapPinIcon class="h-4 w-4" />
                      {{ step.location }}
                    </span>
                  </div>
                </div>
                <span :class="getStepStatusClass(step.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                  {{ step.status }}
                </span>
              </div>
              
              <p class="text-gray-700 mb-4 leading-relaxed">{{ step.description }}</p>
              
              <!-- 详细信息 -->
              <div v-if="step.details" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div 
                  v-for="(detail, key) in step.details" 
                  :key="key"
                  class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 font-medium">{{ key }}</span>
                    <span class="text-sm text-gray-900 font-semibold">{{ detail }}</span>
                  </div>
                </div>
              </div>

              <!-- 相关文件/图片 -->
              <div v-if="step.attachments && step.attachments.length > 0" class="border-t border-gray-200 pt-4">
                <h5 class="text-sm font-medium text-gray-700 mb-3">相关文件</h5>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="attachment in step.attachments" 
                    :key="attachment.name"
                    @click="viewAttachment(attachment)"
                    class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm transition-colors">
                    <DocumentIcon class="h-4 w-4 text-blue-600" />
                    {{ attachment.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 质量检测报告 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="font-bold text-xl mb-6 flex items-center text-gray-900">
        <BeakerIcon class="h-6 w-6 text-blue-600 mr-3" />
        质量检测报告
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="report in testReports" :key="report.id" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900">{{ report.title }}</h4>
            <span :class="getTestResultClass(report.result)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ report.result }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">检测机构</span>
              <span class="font-medium">{{ report.institution }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">检测日期</span>
              <span class="font-medium">{{ report.date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">报告编号</span>
              <span class="font-medium">{{ report.reportNo }}</span>
            </div>
          </div>
          <button 
            @click="viewReport(report)"
            class="mt-3 w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium">
            查看详细报告
          </button>
        </div>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap justify-center gap-4">
        <button 
          @click="printResult" 
          class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <PrinterIcon class="h-5 w-5" />
          打印报告
        </button>
        <button 
          @click="shareResult" 
          class="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <ShareIcon class="h-5 w-5" />
          分享结果
        </button>
        <button 
          @click="downloadReport" 
          class="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <ArrowDownTrayIcon class="h-5 w-5" />
          下载报告
        </button>
        <button 
          @click="exportPDF" 
          class="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <DocumentArrowDownIcon class="h-5 w-5" />
          导出PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CubeIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserIcon,
  ClockIcon,
  BeakerIcon,
  DocumentIcon,
  PrinterIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  // 时间线图标 - 使用存在的图标
  SparklesIcon, // 替代 SeedlingIcon，表示种植
  CogIcon,
  TruckIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

// 产品基本信息
const productInfo = ref({
  code: 'TRACE-2025-001',
  name: '有机小麦粉',
  category: '粮食制品',
  origin: '黑龙江省哈尔滨市',
  date: '2025-01-15',
  status: '溯源认证',
  batchNo: 'B20250115001',
  weight: '1kg',
  package: '真空包装',
  shelfLife: '12个月',
  producer: '绿色农业有限公司',
  phone: '400-123-4567',
  license: 'SC10123456789',
  image: null
})

// 溯源步骤
const traceSteps = ref([
  {
    title: '种植阶段',
    date: '2024-03-10',
    time: '08:00',
    location: '黑龙江有机农场',
    status: '已完成',
    icon: 'SparklesIcon',
    description: '采用有机种植方式，严格按照有机标准进行田间管理，无农药无化肥，确保原料的天然品质。',
    details: {
      '种植面积': '500亩',
      '种植品种': '有机小麦',
      '负责人': '张农户',
      '认证编号': 'ORG-2024-001',
      '土壤检测': '合格',
      '灌溉方式': '滴灌'
    },
    attachments: [
      { name: '种植许可证.pdf', type: 'pdf' },
      { name: '土壤检测报告.pdf', type: 'pdf' }
    ]
  },
  {
    title: '收获阶段',
    date: '2024-09-15',
    time: '06:00',
    location: '黑龙江有机农场',
    status: '已完成',
    icon: 'ScaleIcon',
    description: '适时收获，采用现代化收割设备，确保小麦品质，收获后立即进行初步处理和储存。',
    details: {
      '收获产量': '1200吨',
      '水分含量': '13.5%',
      '杂质含量': '0.8%',
      '收获设备': '联合收割机',
      '储存方式': '低温仓储',
      '质检员': '李质检'
    },
    attachments: [
      { name: '收获记录表.xlsx', type: 'excel' },
      { name: '初检报告.pdf', type: 'pdf' }
    ]
  },
  {
    title: '加工包装',
    date: '2025-01-10',
    time: '09:00',
    location: '绿色食品加工厂',
    status: '已完成',
    icon: 'CogIcon',
    description: '通过有机认证工厂加工，采用现代化设备和自动化包装流水线，严格控制加工过程。',
    details: {
      '加工工艺': '石磨研磨',
      '加工批次': 'P20250110001',
      '包装规格': '1kg/袋',
      '生产线': 'A线',
      '操作员': '王师傅',
      '包装日期': '2025-01-10'
    },
    attachments: [
      { name: '生产记录单.pdf', type: 'pdf' },
      { name: '包装检验单.pdf', type: 'pdf' }
    ]
  },
  {
    title: '物流运输',
    date: '2025-01-12',
    time: '14:00',
    location: '冷链物流中心',
    status: '已完成',
    icon: 'TruckIcon',
    description: '采用专业冷链物流运输，全程温控监测，GPS实时跟踪，确保产品在运输过程中的品质。',
    details: {
      '运输公司': '冷链物流有限公司',
      '运输车辆': '冷藏车A001',
      '运输温度': '2-8℃',
      '运输距离': '1200公里',
      '司机': '赵师傅',
      '到达时间': '2025-01-13 10:00'
    },
    attachments: [
      { name: '运输单据.pdf', type: 'pdf' },
      { name: '温度记录.xlsx', type: 'excel' }
    ]
  },
  {
    title: '质量检测',
    date: '2025-01-13',
    time: '15:00',
    location: '国家食品检测中心',
    status: '已完成',
    icon: 'BeakerIcon',
    description: '经权威第三方检测机构全面检测，包括农残、重金属、微生物等多项指标，检测结果全部合格。',
    details: {
      '检测机构': '国家食品检测中心',
      '检测报告': 'TEST-2025-0113',
      '检测项目': '农残、重金属、微生物',
      '检测结果': '全部合格',
      '检测员': '陈检测',
      '报告日期': '2025-01-14'
    },
    attachments: [
      { name: '检测报告.pdf', type: 'pdf' },
      { name: '检测数据.xlsx', type: 'excel' }
    ]
  }
])

// 检测报告
const testReports = ref([
  {
    id: 1,
    title: '农药残留检测',
    institution: '国家食品检测中心',
    date: '2025-01-13',
    reportNo: 'TEST-2025-0113-01',
    result: '合格'
  },
  {
    id: 2,
    title: '重金属检测',
    institution: '国家食品检测中心',
    date: '2025-01-13',
    reportNo: 'TEST-2025-0113-02',
    result: '合格'
  },
  {
    id: 3,
    title: '微生物检测',
    institution: '国家食品检测中心',
    date: '2025-01-13',
    reportNo: 'TEST-2025-0113-03',
    result: '合格'
  },
  {
    id: 4,
    title: '营养成分检测',
    institution: '营养检测实验室',
    date: '2025-01-14',
    reportNo: 'NUT-2025-0114-01',
    result: '优秀'
  }
])

onMounted(() => {
  loadTraceData()
})

function loadTraceData() {
  // 从路由参数或查询参数获取溯源码
  const code = route.query.code || route.params.code
  if (code) {
    productInfo.value.code = code
  }
  // 这里可以根据溯源码调用API获取数据
}

function goBack() {
  router.go(-1)
}

function refreshData() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    // 重新加载数据
    loadTraceData()
  }, 1000)
}

function getStepStatusClass(status) {
  const classes = {
    '已完成': 'bg-green-100 text-green-800',
    '进行中': 'bg-blue-100 text-blue-800',
    '待开始': 'bg-gray-100 text-gray-800',
    '异常': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getTestResultClass(result) {
  const classes = {
    '合格': 'bg-green-100 text-green-800',
    '优秀': 'bg-blue-100 text-blue-800',
    '不合格': 'bg-red-100 text-red-800'
  }
  return classes[result] || 'bg-gray-100 text-gray-800'
}

function viewAttachment(attachment) {
  // 查看附件
  alert(`查看附件: ${attachment.name}`)
}

function viewReport(report) {
  // 查看详细报告
  alert(`查看检测报告: ${report.title}`)
}

function printResult() {
  window.print()
}

function shareResult() {
  if (navigator.share) {
    navigator.share({
      title: '溯源查询结果',
      text: `产品：${productInfo.value.name}，溯源码：${productInfo.value.code}`,
      url: window.location.href
    })
  } else {
    const text = `产品：${productInfo.value.name}，溯源码：${productInfo.value.code}，查询时间：${new Date().toLocaleString()}`
    navigator.clipboard.writeText(text).then(() => {
      alert('结果已复制到剪贴板')
    })
  }
}

function downloadReport() {
  // 下载文本报告
  const content = generateReportContent()
  const link = document.createElement('a')
  link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
  link.download = `溯源报告_${productInfo.value.code}.txt`
  link.click()
}

function exportPDF() {
  // 导出PDF报告
  alert('PDF导出功能开发中...')
}

function generateReportContent() {
  let content = `溯源报告\n\n`
  content += `产品名称：${productInfo.value.name}\n`
  content += `溯源码：${productInfo.value.code}\n`
  content += `生产地：${productInfo.value.origin}\n`
  content += `生产日期：${productInfo.value.date}\n\n`
  
  content += `溯源流程：\n`
  traceSteps.value.forEach((step, index) => {
    content += `${index + 1}. ${step.title} (${step.date})\n`
    content += `   ${step.description}\n\n`
  })
  
  return content
}
</script>

<style scoped>
.trace-result-page {
  max-width: 1200px;
  margin: 0 auto;
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .trace-result-page {
    padding: 1rem;
  }
  
  .ml-20 {
    margin-left: 3rem;
  }
}
</style>

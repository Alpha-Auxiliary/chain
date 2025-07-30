<template>
  <aside class="side-menu fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-xl z-40">
    <!-- 头部 Logo 区域 -->
    <div class="header-section p-6 border-b border-gray-700 flex-shrink-0">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <BeakerIcon class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">溯农云链</h1>
          <p class="text-xs text-gray-300">管理系统</p>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
      <div v-for="group in menuGroups" :key="group.label" class="mb-6">
        <div 
          class="menu-group-header flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700"
          @click="toggleGroup(group.label)"
        >
          <div class="flex items-center gap-3">
            <component :is="group.iconComponent" class="h-5 w-5" />
            <span class="font-medium">{{ group.label }}</span>
          </div>
          <ChevronDownIcon 
            class="h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': expandedGroups[group.label] }"
          />
        </div>
        
        <transition name="submenu">
          <div v-show="expandedGroups[group.label]" class="mt-2 ml-4">
            <router-link
              v-for="item in group.children"
              :key="item.path"
              :to="item.path"
              class="submenu-item flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              <component :is="item.iconComponent" class="h-4 w-4" />
              <span>{{ item.label }}</span>
            </router-link>
          </div>
        </transition>
      </div>
    </nav>
  </aside>
</template>
<script setup>
import { reactive } from 'vue'
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  BeakerIcon,
  ArchiveBoxIcon,
  QrCodeIcon,
  LinkIcon,
  ChevronDownIcon,
  MagnifyingGlassPlusIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PlusCircleIcon,
  CircleStackIcon,
  TagIcon,
  PlusIcon,
  Bars3BottomLeftIcon
} from '@heroicons/vue/24/outline'

const menuGroups = [
  {
    label: '用户功能', 
    iconComponent: UsersIcon,
    children: [
      { path: '/trace/query', label: '扫码查询', iconComponent: QrCodeIcon },
      { path: '/trace/result', label: '溯源结果', iconComponent: MagnifyingGlassPlusIcon },
    ]
  },
  {
    label: '监管管理', 
    iconComponent: ShieldCheckIcon,
    children: [
      { path: '/trace/admin/audit', label: '数据审核', iconComponent: CheckCircleIcon },
      { path: '/trace/admin/statistics', label: '统计分析', iconComponent: ChartBarIcon },
    ]
  },
  {
    label: '农户管理', 
    iconComponent: BeakerIcon,
    children: [
      { path: '/trace/farmer/add', label: '数据录入', iconComponent: PlusCircleIcon },
      { path: '/trace/farmer/manage', label: '数据管理', iconComponent: CircleStackIcon },
    ]
  },
  {
    label: '产品管理', 
    iconComponent: ArchiveBoxIcon,
    children: [
      { path: '/trace/admin/category', label: '分类管理', iconComponent: TagIcon },
      { path: '/trace/admin/category/add', label: '添加分类', iconComponent: PlusIcon },
    ]
  },
  {
    label: '赋码管理', 
    iconComponent: QrCodeIcon,
    children: [
      { path: '/trace/admin/code', label: '码管理', iconComponent: QrCodeIcon },
      { path: '/trace/admin/code/add', label: '生成码', iconComponent: PlusIcon },
    ]
  },
  {
    label: '环节管理', 
    iconComponent: LinkIcon,
    children: [
      { path: '/trace/admin/trace', label: '流程管理', iconComponent: Bars3BottomLeftIcon },
    ]
  },
]

const expandedGroups = reactive({
  '用户功能': false,
  '监管管理': false,
  '农户管理': false,
  '产品管理': false,
  '赋码管理': false,
  '环节管理': false,
})

function toggleGroup(groupLabel) {
  expandedGroups[groupLabel] = !expandedGroups[groupLabel]
}
</script>
<style scoped>
/* 隐藏滚动条但保持滚动功能 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* 子菜单展开动画 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* 菜单项悬停效果 */
.menu-item:hover,
.submenu-item:hover {
  transform: translateX(2px);
}

/* 活跃状态样式 */
.router-link-active {
  position: relative;
}

.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #3b82f6;
  border-radius: 0 2px 2px 0;
}

/* 图标统一宽度 */
.fa {
  width: 18px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .side-menu {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    height: 100vh;
  }
}
</style> 

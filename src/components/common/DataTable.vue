<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <slot name="toolbar-left"></slot>
        </div>
        <div class="flex items-center space-x-4">
          <slot name="toolbar-right"></slot>
        </div>
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th v-if="selectable" class="px-4 py-3 text-left">
              <input 
                type="checkbox" 
                :checked="allSelected" 
                @change="toggleSelectAll"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              >
            </th>
            <th v-for="column in columns" 
                :key="column.key"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="column.headerClass"
                :style="column.width ? { width: column.width } : {}">
              <div class="flex items-center">
                {{ column.title }}
                <button v-if="column.sortable" 
                        @click="sort(column.key)"
                        class="ml-1 text-gray-400 hover:text-gray-600">
                  <i class="fa fa-sort" 
                     :class="getSortIcon(column.key)"></i>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="loading" class="text-center">
            <td :colspan="totalColumns" class="px-4 py-8">
              <i class="fa fa-spinner fa-spin mr-2"></i>
              加载中...
            </td>
          </tr>
          <tr v-else-if="data.length === 0" class="text-center">
            <td :colspan="totalColumns" class="px-4 py-8 text-gray-500">
              暂无数据
            </td>
          </tr>
          <tr v-else v-for="(row, index) in data" 
              :key="getRowKey(row, index)"
              class="hover:bg-gray-50"
              :class="getRowClass(row, index)">
            <td v-if="selectable" class="px-4 py-3">
              <slot name="selection" :row="row" :index="index">
                <input 
                  type="checkbox" 
                  :checked="isRowSelected(row)"
                  @change="toggleRowSelection(row)"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                >
              </slot>
            </td>
            <td v-for="column in columns" 
                :key="column.key"
                class="px-4 py-3"
                :class="column.cellClass">
              <slot :name="column.key" :row="row" :index="index">
                {{ formatCellValue(row[column.key], column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="pagination && total > 0" class="bg-gray-50 px-4 py-3 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-700">
          <span>共 {{ total }} 条记录</span>
          <span class="mx-2">|</span>
          <span>每页显示 {{ pageSize }} 条</span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            上一页
          </button>
          <span class="px-3 py-1 text-sm">
            第 {{ currentPage }} / {{ totalPages }} 页
          </span>
          <button 
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  pagination: { type: Boolean, default: true },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  rowKey: { type: String, default: 'id' },
  showToolbar: { type: Boolean, default: true },
  exportable: { type: Boolean, default: false },
  selectedRows: { type: Array, default: () => [] }
})

const emit = defineEmits(['page-change', 'sort-change', 'selection-change'])

const sortField = ref('')
const sortOrder = ref('') // 'asc' | 'desc'

const totalColumns = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  return count
})

const allSelected = computed(() => {
  if (props.data.length === 0) return false
  return props.data.every(row => isRowSelected(row))
})

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

function getRowKey(row, index) {
  return row[props.rowKey] || index
}

function getRowClass(row, index) {
  return ''
}

function formatCellValue(value, column) {
  if (column.formatter && typeof column.formatter === 'function') {
    return column.formatter(value)
  }
  return value
}

function isRowSelected(row) {
  const key = getRowKey(row)
  return props.selectedRows.includes(key)
}

function toggleRowSelection(row) {
  const key = getRowKey(row)
  const newSelection = [...props.selectedRows]
  const index = newSelection.indexOf(key)
  
  if (index > -1) {
    newSelection.splice(index, 1)
  } else {
    newSelection.push(key)
  }
  
  emit('selection-change', newSelection)
}

function toggleSelectAll() {
  if (allSelected.value) {
    // 取消全选
    const currentKeys = props.data.map(row => getRowKey(row))
    const newSelection = props.selectedRows.filter(key => !currentKeys.includes(key))
    emit('selection-change', newSelection)
  } else {
    // 全选
    const currentKeys = props.data.map(row => getRowKey(row))
    const newSelection = [...new Set([...props.selectedRows, ...currentKeys])]
    emit('selection-change', newSelection)
  }
}

function sort(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  emit('sort-change', { field: sortField.value, order: sortOrder.value })
}

function getSortIcon(field) {
  if (sortField.value !== field) return ''
  return sortOrder.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}
</script> 

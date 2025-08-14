<template>
  <DataTable
    :columns="columns"
    :data="filteredData"
    @add="showAdd"
    @edit="showEdit"
    @delete="showDelete"
  >
    <template #search>
      <input
        v-model="search"
        class="border rounded px-3 py-1"
        placeholder="搜索环节..."
      />
    </template>
  </DataTable>

  <!-- 添加/编辑 -->
  <EditDialog
    :visible="dialogVisible"
    title="添加/编辑环节"
    :onSubmit="handleSubmit"
    :onCancel="() => (dialogVisible = false)"
  >
    <input
      v-model="form.name"
      class="border rounded px-3 py-2 w-full mb-3"
      placeholder="环节名称"
    />
    <input
      v-model="form.status"
      class="border rounded px-3 py-2 w-full mb-3"
      placeholder="状态"
    />
    <input
      v-model="form.remark"
      class="border rounded px-3 py-2 w-full mb-3"
      placeholder="备注"
    />
  </EditDialog>
  <!-- 删除确认 -->
  <ConfirmDialog
    :visible="deleteDialogVisible"
    :message="`确定要删除环节 ${deleteRow?.name} 吗？此操作不可恢复。`"
    :onConfirm="confirmDelete"
    :onCancel="() => (deleteDialogVisible = false)"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import DataTable from '../components/common/DataTable.vue'
import EditDialog from '../components/common/EditDialog.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'

const columns = [
  { title: '环节名称', key: 'name' },
  { title: '状态', key: 'status' },
  { title: '备注', key: 'remark' },
]

const data = ref([{ id: 1, name: '种植', status: '正常', remark: '' }])
const search = ref('')
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const form = ref({ name: '', status: '正常', remark: '' })
const deleteRow = ref(null)

const filteredData = computed(() =>
  data.value.filter((row) =>
    row.name.includes(search.value.trim())
  )
)

function showAdd() {
  form.value = { name: '', status: '正常', remark: '' }
  dialogVisible.value = true
}

function showEdit(row) {
  form.value = { ...row }
  dialogVisible.value = true
}

function handleSubmit() {
  if (form.value.id) {
    // 编辑
    const index = data.value.findIndex((d) => d.id === form.value.id)
    if (index !== -1) data.value[index] = { ...form.value }
  } else {
    // 添加
    form.value.id = Date.now()
    data.value.push({ ...form.value })
  }
  dialogVisible.value = false
}

function showDelete(row) {
  deleteRow.value = row
  deleteDialogVisible.value = true
}

function confirmDelete() {
  data.value = data.value.filter((d) => d.id !== deleteRow.value.id)
  deleteDialogVisible.value = false
}
</script>

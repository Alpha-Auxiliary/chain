<template>
  <DataTable :columns="columns" :data="data" @add="showAdd" @edit="showEdit" @delete="showDelete">
    <template #search>
      <input v-model="search" class="border rounded px-3 py-1" placeholder="搜索产品..." />
    </template>
  </DataTable>
  <EditDialog :visible="dialogVisible" title="添加/编辑产品" :onSubmit="handleSubmit" :onCancel="() => dialogVisible=false">
    <input v-model="form.name" class="border rounded px-3 py-2 w-full mb-3" placeholder="产品名称" />
    <input v-model="form.code" class="border rounded px-3 py-2 w-full mb-3" placeholder="产品编码" />
    <input v-model="form.status" class="border rounded px-3 py-2 w-full mb-3" placeholder="状态" />
    <input v-model="form.remark" class="border rounded px-3 py-2 w-full mb-3" placeholder="备注" />
  </EditDialog>
</template>
<script setup>
import { ref } from 'vue'
import DataTable from '../components/common/DataTable.vue'
import EditDialog from '../components/common/EditDialog.vue'
const columns = [ { title: '产品名称', key: 'name' }, { title: '产品编码', key: 'code' }, { title: '状态', key: 'status' }, { title: '备注', key: 'remark' } ]
const data = ref([ { id: 1, name: '苹果', code: 'apple001', status: '正常', remark: '' } ])
const search = ref('')
const dialogVisible = ref(false)
const form = ref({ name: '', code: '', status: '正常', remark: '' })
function showAdd() { dialogVisible.value = true }
function showEdit(row) { form.value = { ...row }; dialogVisible.value = true }
function showDelete(row) { /* 删除逻辑 */ }
function handleSubmit() { /* 提交逻辑 */ dialogVisible.value = false }
</script> 
<template>
  <div v-if="visible" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative">
      <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
      <form @submit.prevent="onSubmit">
        <slot></slot>
        <div class="flex justify-end mt-6">
          <button type="button" class="mr-4 px-4 py-2 rounded border" @click="onCancel">取消</button>
          <button type="submit" class="bg-primary text-white px-6 py-2 rounded">确定</button>
        </div>
      </form>
      <button class="absolute top-4 right-4 text-gray-400" @click="onCancel">
        <i class="fa fa-close"></i>
      </button>
    </div>
  </div>
</template>
<script setup>
defineProps(['visible', 'title', 'onSubmit', 'onCancel'])
</script> 
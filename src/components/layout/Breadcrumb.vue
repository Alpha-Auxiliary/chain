<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-4">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <ChevronRightIcon v-if="index > 0" class="h-4 w-4 text-gray-400 mr-4" />
        
        <router-link
          v-if="item.path && index < items.length - 1"
          :to="item.path"
          class="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          {{ item.label }}
        </router-link>
        
        <span
          v-else
          class="text-sm font-medium"
          :class="index === items.length - 1 ? 'text-gray-900' : 'text-gray-500'"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>
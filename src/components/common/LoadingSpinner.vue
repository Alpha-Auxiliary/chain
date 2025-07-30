<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" 
         :class="spinnerClass">
    </div>
    <span v-if="text" class="ml-3 text-gray-600" :class="textClass">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: 'p-4'
  }
})

const spinnerClass = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  return sizes[props.size] || sizes.md
})

const textClass = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  return sizes[props.size] || sizes.md
})
</script>
<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClass"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="help" class="mt-1 text-sm text-gray-500">{{ help }}</p>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  error: String,
  help: String,
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = useId()

const inputClass = computed(() => {
  const baseClass = 'block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  const errorClass = props.error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
  const disabledClass = props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
  
  return [baseClass, sizeClass[props.size], errorClass, disabledClass].filter(Boolean).join(' ')
})
</script>
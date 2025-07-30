<template>
  <div>
    <h3>溯源结果</h3>
    <!-- 展示种植、加工、物流、检测等信息 -->
    <div v-if="data">
      <div>种植信息: {{ data.growInfo }}</div>
      <div>加工信息: {{ data.processInfo }}</div>
      <div>物流信息: {{ data.logisticsInfo }}</div>
      <div>检测信息: {{ data.testInfo }}</div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  data: Object
})
</script> 
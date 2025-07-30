<template>
  <div class="flex min-h-screen bg-gray-100">
    <SideMenu />
    <div class="flex-1 flex flex-col ml-64">
      <TopBar @logout="logout" />
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
<script setup>
import { SideMenu, TopBar } from '@/components/layout'
import { useRouter } from 'vue-router'
const router = useRouter()
function logout() {
  localStorage.removeItem('isAdminLogin')
  router.push('/login')
}
</script>
<style scoped>
.logout-btn {
  display: none;
}
</style> 

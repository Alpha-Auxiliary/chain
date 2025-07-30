import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES, STORAGE_KEYS } from '@/constants'
import { storage } from '@/utils'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('@/layout/AdminLayout.vue'),
    children: [
      {
        path: '',
        redirect: ROUTES.LOGIN
      },
      // 用户查询模块
      {
        path: 'trace/query',
        name: 'TraceQuery',
        component: () => import('@/views/TraceQuery.vue')
      },
      {
        path: 'trace/result',
        name: 'TraceResult',
        component: () => import('@/views/TraceResultPage.vue')
      },
      // 管理后台模块
      {
        path: 'trace/admin',
        redirect: ROUTES.ADMIN_HOME,
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/home',
        name: 'AdminHome',
        component: () => import('@/views/AdminHome.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/category',
        name: 'ProductCategory',
        component: () => import('@/views/ProductCategory.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/category/add',
        name: 'ProductCategoryAdd',
        component: () => import('@/views/ProductCategoryAdd.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/product',
        name: 'ProductList',
        component: () => import('@/views/ProductList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/supply',
        name: 'SupplyList',
        component: () => import('@/views/SupplyList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/trace',
        name: 'TraceLink',
        component: () => import('@/views/TraceLink.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/code',
        name: 'CodeManage',
        component: () => import('@/views/CodeManage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/code/add',
        name: 'CodeAdd',
        component: () => import('@/views/CodeAdd.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/audit',
        name: 'AuditPage',
        component: () => import('@/views/AuditPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/admin/statistics',
        name: 'StatisticsPage',
        component: () => import('@/views/StatisticsPage.vue'),
        meta: { requiresAuth: true }
      },
      // 农户管理模块
      {
        path: 'trace/farmer/add',
        name: 'TraceFarmerAdd',
        component: () => import('@/views/TraceFarmerAdd.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'trace/farmer/manage',
        name: 'TraceFarmerManage',
        component: () => import('@/views/TraceFarmerManage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = storage.get(STORAGE_KEYS.IS_ADMIN_LOGIN) === 'true'
  
  console.log('路由守卫检查:', { to: to.path, isLogin }) // 添加调试日志
  
  if (to.meta.requiresAuth && !isLogin) {
    console.log('需要登录，跳转到登录页')
    next(ROUTES.LOGIN)
    return
  }
  
  if (to.meta.requiresGuest && isLogin) {
    console.log('已登录用户访问登录页，跳转到首页')
    next(ROUTES.ADMIN_HOME)
    return
  }
  
  next()
})

export default router









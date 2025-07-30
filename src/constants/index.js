// 路由常量
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  TRACE_QUERY: '/trace/query',
  TRACE_RESULT: '/trace/result',
  ADMIN_HOME: '/trace/admin/home',
  ADMIN_CATEGORY: '/trace/admin/category',
  ADMIN_PRODUCT: '/trace/admin/product',
  FARMER_ADD: '/trace/farmer/add',
  FARMER_MANAGE: '/trace/farmer/manage'
}

// API 端点
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  TRACE: '/trace',
  BLOCKCHAIN: '/blockchain'
}

// 本地存储键
export const STORAGE_KEYS = {
  IS_ADMIN_LOGIN: 'isAdminLogin',
  USER_INFO: 'userInfo',
  TOKEN: 'token'
}

// 业务常量
export const BUSINESS_CONSTANTS = {
  TRACE_STEPS: ['种植', '加工', '物流', '检测'],
  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending'
  }
}
import axios from 'axios'
import { storage } from '@/utils'

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加token
instance.interceptors.request.use(
  (config) => {
    const token = storage.get('token')
    console.log('请求拦截器 - token:', token) // 调试日志
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('已添加Authorization头:', config.headers.Authorization)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.log('响应错误:', error.response?.status, error.response?.data)
    if (error.response?.status === 401) {
      // token过期，清除本地存储并跳转登录
      storage.remove('token')
      storage.remove('isAdminLogin')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// 认证相关API
export const authAPI = {
  // 登录
  login(credentials) {
    return instance.post('/auth/login', credentials)
  },
  
  // 注册
  register(userData) {
    return instance.post('/auth/register', userData)
  }
}

// 溯源查询API
export function fetchTraceData(code) {
  return instance.post('/trace', { code })
}

// 产品管理API
export const productAPI = {
  getProducts(params = {}) {
    return instance.get('/products', { params })
  }
}

// 统计数据API
export const statisticsAPI = {
  // 获取统计概览
  getStatistics() {
    return instance.get('/statistics')
  },
  
  // 获取查询趋势
  getQueryTrend(params = {}) {
    return instance.get('/statistics/query-trend', { params })
  },
  
  // 获取分类分布
  getCategoryDistribution() {
    return instance.get('/statistics/category-distribution')
  }
}

// 用户管理API
export const userAPI = {
  // 获取用户列表
  getUsers(params = {}) {
    return instance.get('/users', { params })
  },
  
  // 创建用户
  createUser(userData) {
    return instance.post('/users', userData)
  },
  
  // 更新用户
  updateUser(id, userData) {
    return instance.put(`/users/${id}`, userData)
  },
  
  // 删除用户
  deleteUser(id) {
    return instance.delete(`/users/${id}`)
  }
}

// 溯源管理API
export const traceAPI = {
  // 获取溯源记录列表
  getRecords(params = {}) {
    return instance.get('/trace/records', { params })
  },
  
  // 创建溯源记录
  createRecord(data) {
    return instance.post('/trace/records', data)
  },
  
  // 添加溯源步骤
  addStep(data) {
    return instance.post('/trace/steps', data)
  }
}

// 分类管理API
export const categoryAPI = {
  getCategories() {
    return instance.get('/categories')
  }
}

export default instance
// src/api/blockchain.js
import { ethers } from "ethers";

// 1. 连接钱包
export async function connectWallet() {
  if (!window.ethereum) throw new Error("请先安装MetaMask等以太坊钱包插件");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer, address: await signer.getAddress() };
}

// 2. 获取合约实例
export function getContract(contractAddress, abi, signerOrProvider) {
  return new ethers.Contract(contractAddress, abi, signerOrProvider);
}

// 3. 读取合约数据（示例）
export async function readContract(contractAddress, abi, method, args = []) {
  const { provider } = await connectWallet();
  const contract = getContract(contractAddress, abi, provider);
  return contract[method](...args);
}

// 4. 写入合约数据（示例）
export async function writeContract(contractAddress, abi, method, args = []) {
  const { signer } = await connectWallet();
  const contract = getContract(contractAddress, abi, signer);
  const tx = await contract[method](...args);
  return tx.wait();
} 

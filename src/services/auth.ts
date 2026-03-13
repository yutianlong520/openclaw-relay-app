/**
 * 认证服务
 * 处理用户登录、注册、API Key 管理
 */

import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useConnectionStore } from '@/stores/connection'

const API_BASE_URL = 'https://your-server.com/api/v1'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    username: string
    email: string
  }
  token?: string
  apiKey?: string
  error?: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: number
  expiresAt: number
  isActive: boolean
}

class AuthService {
  private userStore = useUserStore()
  private connectionStore = useConnectionStore()
  
  /**
   * 用户登录
   */
  async login(params: LoginParams): Promise<AuthResponse> {
    try {
      const response = await uni.request({
        url: `${API_BASE_URL}/auth/login`,
        method: 'POST',
        data: params
      })
      
      const data = response.data as any
      
      if (data.success) {
        this.userStore.setUser(data.data.user)
        this.userStore.setToken(data.data.token)
        this.userStore.setApiKey(data.data.apiKey)
        
        return {
          success: true,
          user: data.data.user,
          token: data.data.token,
          apiKey: data.data.apiKey
        }
      } else {
        return {
          success: false,
          error: data.error?.message || '登录失败'
        }
      }
    } catch (error: any) {
      console.error('登录请求失败:', error)
      return {
        success: false,
        error: error.message || '网络错误'
      }
    }
  }
  
  /**
   * 用户注册
   */
  async register(params: RegisterParams): Promise<AuthResponse> {
    try {
      const response = await uni.request({
        url: `${API_BASE_URL}/auth/register`,
        method: 'POST',
        data: params
      })
      
      const data = response.data as any
      
      if (data.success) {
        this.userStore.setUser(data.data.user)
        this.userStore.setToken(data.data.token)
        
        return {
          success: true,
          user: data.data.user,
          token: data.data.token
        }
      } else {
        return {
          success: false,
          error: data.error?.message || '注册失败'
        }
      }
    } catch (error: any) {
      console.error('注册请求失败:', error)
      return {
        success: false,
        error: error.message || '网络错误'
      }
    }
  }
  
  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      const token = uni.getStorageSync('token')
      if (token) {
        await uni.request({
          url: `${API_BASE_URL}/auth/logout`,
          method: 'POST',
          header: {
            Authorization: `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      this.userStore.logout()
      this.connectionStore.disconnect()
    }
  }
  
  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const token = uni.getStorageSync('token')
      if (!token) {
        return {
          success: false,
          error: '未登录'
        }
      }
      
      const response = await uni.request({
        url: `${API_BASE_URL}/auth/me`,
        method: 'GET',
        header: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const data = response.data as any
      
      if (data.success) {
        this.userStore.setUser(data.data)
        
        return {
          success: true,
          user: data.data
        }
      } else {
        return {
          success: false,
          error: data.error?.message || '获取用户信息失败'
        }
      }
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      return {
        success: false,
        error: error.message || '网络错误'
      }
    }
  }
  
  /**
   * 创建 API Key
   */
  async createApiKey(name: string): Promise<{ success: boolean; apiKey?: ApiKey; error?: string }> {
    try {
      const token = uni.getStorageSync('token')
      const response = await uni.request({
        url: `${API_BASE_URL}/keys`,
        method: 'POST',
        header: {
          Authorization: `Bearer ${token}`
        },
        data: { name }
      })
      
      const data = response.data as any
      
      if (data.success) {
        return {
          success: true,
          apiKey: data.data
        }
      } else {
        return {
          success: false,
          error: data.error?.message || '创建失败'
        }
      }
    } catch (error: any) {
      console.error('创建 API Key 失败:', error)
      return {
        success: false,
        error: error.message || '网络错误'
      }
    }
  }
  
  /**
   * 获取 API Key 列表
   */
  async getApiKeys(): Promise<{ success: boolean; apiKeys?: ApiKey[]; error?: string }> {
    try {
      const token = uni.getStorageSync('token')
      const response = await uni.request({
        url: `${API_BASE_URL}/keys`,
        method: 'GET',
        header: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const data = response.data as any
      
      if (data.success) {
        return {
          success: true,
          apiKeys: data.data
        }
      } else {
        return {
          success: false,
          error: data.error?.message || '获取失败'
        }
      }
    } catch (error: any) {
      console.error('获取 API Key 列表失败:', error)
      return {
        success: false,
        error: error.message || '网络错误'
      }
    }
  }
  
  /**
   * 删除 API Key
   */
  async deleteApiKey(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = uni.getStorageSync('token')
      const response = await uni.request({
        url: `${API_BASE_URL}/keys/${id}`,
        method: 'DELETE',
        header: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const data = response.data as any
      
      if (data.success) {
        return { success: true }
      } else {
        return {
          success: false,
          error: data.error?.message || '删除失败'
        }
      }
    } catch (error: any) {
      console.error('删除 API Key 失败:', error)
      return {
        success: false,
        error: error.message || '网络错误'
      }
    }
  }
  
  /**
   * 检查登录状态
   */
  checkLoginStatus(): boolean {
    const token = uni.getStorageSync('token')
    return !!token
  }
  
  /**
   * 从存储加载登录状态
   */
  loadLoginStatus(): void {
    this.userStore.loadFromStorage()
  }
}

// 导出单例
export const authService = new AuthService()
export default authService

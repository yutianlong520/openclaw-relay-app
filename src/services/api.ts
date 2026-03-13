/**
 * API 服务
 * 封装通用 API 请求方法
 */

const API_BASE_URL = 'https://your-server.com/api/v1'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp?: number
}

class ApiService {
  private baseUrl: string
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }
  
  /**
   * 发起请求
   */
  private async request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    const token = uni.getStorageSync('token')
    
    const defaultHeader: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (token) {
      defaultHeader['Authorization'] = `Bearer ${token}`
    }
    
    try {
      const response = await uni.request({
        url: options.url.startsWith('http') 
          ? options.url 
          : `${this.baseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data,
        header: {
          ...defaultHeader,
          ...options.header
        }
      })
      
      const data = response.data as ApiResponse<T>
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return data
      } else {
        return {
          success: false,
          error: {
            code: 'HTTP_ERROR',
            message: `请求失败 (${response.statusCode})`,
            details: data
          }
        }
      }
    } catch (error: any) {
      console.error('API 请求失败:', error)
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || '网络错误',
          details: error
        }
      }
    }
  }
  
  /**
   * GET 请求
   */
  async get<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      data
    })
  }
  
  /**
   * POST 请求
   */
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data
    })
  }
  
  /**
   * PUT 请求
   */
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data
    })
  }
  
  /**
   * DELETE 请求
   */
  async delete<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data
    })
  }
  
  // ==================== 设备相关 API ====================
  
  /**
   * 获取设备列表
   */
  async getDevices() {
    return this.get<any[]>('/devices')
  }
  
  /**
   * 绑定设备
   */
  async bindDevice(deviceInfo: any) {
    return this.post<any>('/devices/bind', deviceInfo)
  }
  
  /**
   * 解绑设备
   */
  async unbindDevice(deviceId: string) {
    return this.delete<any>(`/devices/${deviceId}`)
  }
  
  /**
   * 获取设备状态
   */
  async getDeviceStatus(deviceId: string) {
    return this.get<any>(`/devices/${deviceId}/status`)
  }
  
  // ==================== 消息相关 API ====================
  
  /**
   * 获取消息历史
   */
  async getMessages(params?: {
    page?: number
    pageSize?: number
    deviceId?: string
  }) {
    return this.get<any[]>('/messages', params)
  }
  
  /**
   * 获取单条消息
   */
  async getMessage(messageId: string) {
    return this.get<any>(`/messages/${messageId}`)
  }
  
  /**
   * 删除消息
   */
  async deleteMessage(messageId: string) {
    return this.delete<any>(`/messages/${messageId}`)
  }
}

// 导出单例
export const apiService = new ApiService()
export default apiService

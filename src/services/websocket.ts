/**
 * WebSocket 服务封装
 * 提供统一的 WebSocket 连接管理
 */

import { ref } from 'vue'

export type MessageHandler = (data: any) => void

class WebSocketService {
  private socket: UniApp.SocketTask | null = null
  private url: string = ''
  private messageHandlers: Map<string, MessageHandler[]> = new Map()
  private status: 'closed' | 'connecting' | 'connected' = 'closed'
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private pingTimer: ReturnType<typeof setInterval> | null = null
  
  // 状态回调
  public onStatusChange: ((status: 'closed' | 'connecting' | 'connected') => void) | null = null
  public onError: ((error: any) => void) | null = null
  
  /**
   * 连接到 WebSocket 服务器
   */
  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.status === 'connected') {
        resolve()
        return
      }
      
      this.url = url
      this.setStatus('connecting')
      
      try {
        this.socket = uni.connectSocket({
          url,
          fail: (err) => {
            this.setStatus('closed')
            this.onError?.(err)
            reject(err)
          }
        })
        
        if (this.socket) {
          this.socket.onOpen(() => {
            console.log('[WS] 连接已打开')
            this.setStatus('connected')
            this.reconnectAttempts = 0
            this.startPing()
            this.sendAuth()
            resolve()
          })
          
          this.socket.onMessage((res) => {
            this.handleMessage(res.data)
          })
          
          this.socket.onError((err) => {
            console.error('[WS] 连接错误:', err)
            this.onError?.(err)
            this.scheduleReconnect()
          })
          
          this.socket.onClose((res) => {
            console.log('[WS] 连接已关闭:', res.code, res.reason)
            this.setStatus('closed')
            this.stopPing()
            this.scheduleReconnect()
          })
        }
      } catch (error) {
        console.error('[WS] 连接异常:', error)
        this.setStatus('closed')
        reject(error)
      }
    })
  }
  
  /**
   * 断开连接
   */
  disconnect() {
    this.stopPing()
    this.stopReconnect()
    
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    
    this.setStatus('closed')
  }
  
  /**
   * 发送消息
   */
  send(type: string, payload: any): boolean {
    if (this.status !== 'connected' || !this.socket) {
      console.warn('[WS] 未连接，无法发送消息')
      return false
    }
    
    const message = {
      type,
      payload,
      timestamp: Date.now()
    }
    
    try {
      this.socket.send({
        data: JSON.stringify(message),
        fail: (err) => {
          console.error('[WS] 发送消息失败:', err)
        }
      })
      return true
    } catch (error) {
      console.error('[WS] 发送消息异常:', error)
      return false
    }
  }
  
  /**
   * 注册消息处理器
   */
  on(type: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler)
  }
  
  /**
   * 移除消息处理器
   */
  off(type: string, handler?: MessageHandler) {
    if (!handler) {
      this.messageHandlers.delete(type)
    } else {
      const handlers = this.messageHandlers.get(type)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index !== -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }
  
  /**
   * 获取连接状态
   */
  getStatus(): 'closed' | 'connecting' | 'connected' {
    return this.status
  }
  
  /**
   * 获取设备ID
   */
  private getDeviceId(): string {
    let deviceId = uni.getStorageSync('deviceId')
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      uni.setStorageSync('deviceId', deviceId)
    }
    return deviceId
  }
  
  /**
   * 获取设备名称
   */
  private getDeviceName(): string {
    const systemInfo = uni.getSystemInfoSync()
    return systemInfo.model || 'Unknown Device'
  }
  
  /**
   * 获取平台
   */
  private getPlatform(): string {
    return uni.getSystemInfoSync().platform
  }
  
  /**
   * 发送认证请求
   */
  private sendAuth() {
    const apiKey = uni.getStorageSync('apiKey') || ''
    this.send('auth_request', {
      key: apiKey,
      deviceId: this.getDeviceId(),
      clientType: 'app',
      deviceInfo: {
        name: this.getDeviceName(),
        platform: this.getPlatform(),
        version: '1.0.0'
      }
    })
  }
  
  /**
   * 处理接收到的消息
   */
  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data)
      console.log('[WS] 收到消息:', message.type)
      
      const handlers = this.messageHandlers.get(message.type)
      if (handlers) {
        handlers.forEach(handler => handler(message.payload || message))
      }
      
      // 也触发通配符处理器
      const wildcardHandlers = this.messageHandlers.get('*')
      if (wildcardHandlers) {
        wildcardHandlers.forEach(handler => handler(message))
      }
    } catch (error) {
      console.error('[WS] 解析消息失败:', error)
    }
  }
  
  /**
   * 设置连接状态
   */
  private setStatus(status: 'closed' | 'connecting' | 'connected') {
    this.status = status
    this.onStatusChange?.(status)
  }
  
  /**
   * 开始心跳
   */
  private startPing() {
    this.stopPing()
    this.pingTimer = setInterval(() => {
      this.send('ping', { timestamp: Date.now() })
    }, 30000)
  }
  
  /**
   * 停止心跳
   */
  private stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }
  
  /**
   * 计划重连
   */
  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WS] 达到最大重连次数')
      return
    }
    
    this.stopReconnect()
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 60000)
    this.reconnectAttempts++
    
    console.log(`[WS] ${delay / 1000}秒后重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    this.reconnectTimer = setTimeout(() => {
      this.connect(this.url).catch(err => {
        console.error('[WS] 重连失败:', err)
      })
    }, delay)
  }
  
  /**
   * 停止重连
   */
  private stopReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}

// 导出单例
export const websocketService = new WebSocketService()
export default websocketService

import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export const useConnectionStore = defineStore('connection', () => {
  const status = ref<ConnectionStatus>('disconnected')
  const serverUrl = ref('')
  const errorMessage = ref('')
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  
  // WebSocket 实例
  let socket: UniApp.SocketTask | null = null
  let pingTimer: ReturnType<typeof setInterval> | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  
  const setStatus = (newStatus: ConnectionStatus) => {
    status.value = newStatus
  }
  
  const setServerUrl = (url: string) => {
    serverUrl.value = url
  }
  
  const setError = (message: string) => {
    errorMessage.value = message
    status.value = 'error'
  }
  
  const connect = (url?: string) => {
    if (status.value === 'connected' || status.value === 'connecting') {
      return
    }
    
    const wsUrl = url || uni.getStorageSync('serverUrl') || 'wss://your-server.com/ws'
    setServerUrl(wsUrl)
    setStatus('connecting')
    
    try {
      socket = uni.connectSocket({
        url: wsUrl,
        success: () => {
          console.log('WebSocket 连接请求已发送')
        },
        fail: (err) => {
          console.error('WebSocket 连接失败:', err)
          setError(err.errMsg || '连接失败')
          scheduleReconnect()
        }
      })
      
      if (socket) {
        socket.onOpen(() => {
          console.log('WebSocket 已打开')
          setStatus('connected')
          reconnectAttempts.value = 0
          errorMessage.value = ''
          startPing()
          
          // 发送认证请求
          sendAuth()
        })
        
        socket.onMessage((res) => {
          handleMessage(res.data)
        })
        
        socket.onError((err) => {
          console.error('WebSocket 错误:', err)
          setError(err.errMsg || '连接错误')
          scheduleReconnect()
        })
        
        socket.onClose((res) => {
          console.log('WebSocket 已关闭:', res)
          setStatus('disconnected')
          stopPing()
          scheduleReconnect()
        })
      }
    } catch (error) {
      console.error('WebSocket 连接异常:', error)
      setError('连接异常')
      scheduleReconnect()
    }
  }
  
  const disconnect = () => {
    stopPing()
    stopReconnect()
    
    if (socket) {
      socket.close()
      socket = null
    }
    
    setStatus('disconnected')
  }
  
  const send = (data: any): boolean => {
    if (status.value !== 'connected' || !socket) {
      console.warn('WebSocket 未连接，无法发送消息')
      return false
    }
    
    try {
      socket.send({
        data: JSON.stringify(data),
        fail: (err) => {
          console.error('发送消息失败:', err)
        }
      })
      return true
    } catch (error) {
      console.error('发送消息异常:', error)
      return false
    }
  }
  
  const sendAuth = () => {
    const apiKey = uni.getStorageSync('apiKey') || ''
    send({
      type: 'auth_request',
      payload: {
        key: apiKey,
        deviceId: getDeviceId(),
        clientType: 'app',
        deviceInfo: {
          name: getDeviceName(),
          platform: getPlatform(),
          version: '1.0.0'
        }
      }
    })
  }
  
  const startPing = () => {
    stopPing()
    pingTimer = setInterval(() => {
      send({
        type: 'ping',
        timestamp: Date.now()
      })
    }, 30000) // 30秒心跳
  }
  
  const stopPing = () => {
    if (pingTimer) {
      clearInterval(pingTimer)
      pingTimer = null
    }
  }
  
  const scheduleReconnect = () => {
    if (reconnectAttempts.value >= maxReconnectAttempts) {
      console.log('已达到最大重连次数')
      return
    }
    
    stopReconnect()
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 60000)
    reconnectAttempts.value++
    
    console.log(`${delay / 1000}秒后尝试重连 (${reconnectAttempts.value}/${maxReconnectAttempts})`)
    
    reconnectTimer = setTimeout(() => {
      connect(serverUrl.value)
    }, delay)
  }
  
  const stopReconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }
  
  const handleMessage = (data: string) => {
    try {
      const message = JSON.parse(data)
      console.log('收到消息:', message)
      
      switch (message.type) {
        case 'pong':
          // 心跳响应
          break
        case 'auth_response':
          handleAuthResponse(message.payload)
          break
        case 'chat_message':
          handleChatMessage(message.payload)
          break
        case 'device_status':
          handleDeviceStatus(message.payload)
          break
        case 'error':
          console.error('服务器错误:', message.payload)
          break
      }
    } catch (error) {
      console.error('解析消息失败:', error)
    }
  }
  
  const handleAuthResponse = (payload: any) => {
    if (payload.success) {
      console.log('认证成功')
      uni.setStorageSync('token', payload.token)
    } else {
      console.error('认证失败:', payload.error)
      setError(payload.error || '认证失败')
    }
  }
  
  const handleChatMessage = (payload: any) => {
    // 触发全局事件，让聊天页面处理
    uni.$emit('chat_message', payload)
  }
  
  const handleDeviceStatus = (payload: any) => {
    uni.$emit('device_status', payload)
  }
  
  const getDeviceId = (): string => {
    let deviceId = uni.getStorageSync('deviceId')
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      uni.setStorageSync('deviceId', deviceId)
    }
    return deviceId
  }
  
  const getDeviceName = (): string => {
    const systemInfo = uni.getSystemInfoSync()
    return systemInfo.model || 'Unknown Device'
  }
  
  const getPlatform = (): string => {
    return uni.getSystemInfoSync().platform
  }
  
  return {
    status,
    serverUrl,
    errorMessage,
    reconnectAttempts,
    connect,
    disconnect,
    send
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useConnectionStore } from './connection'

export interface Message {
  id: string
  messageId: string
  content: string
  timestamp: number
  direction: 'sent' | 'received'
  type: 'text' | 'image' | 'voice'
  status?: 'sending' | 'sent' | 'delivered' | 'error'
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const currentDeviceId = ref<string | null>(null)
  const isLoading = ref(false)
  const connectionStore = useConnectionStore()
  
  // 计算属性
  const messageCount = computed(() => messages.value.length)
  
  const currentMessages = computed(() => {
    return messages.value
  })
  
  // 添加消息
  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }
    messages.value.push(newMessage)
    return newMessage
  }
  
  // 发送消息
  const sendMessage = (content: string, type: 'text' | 'image' | 'voice' = 'text') => {
    const timestamp = Date.now()
    const messageId = 'msg_' + timestamp + '_' + Math.random().toString(36).substr(2, 9)
    
    // 添加到本地消息列表
    const message = addMessage({
      messageId,
      content,
      timestamp,
      direction: 'sent',
      type,
      status: 'sending'
    })
    
    // 通过 WebSocket 发送
    const success = connectionStore.send({
      type: 'chat_message',
      payload: {
        messageId,
        content,
        type,
        timestamp,
        deviceId: currentDeviceId.value
      }
    })
    
    if (!success) {
      message.status = 'error'
    }
    
    return message
  }
  
  // 接收消息
  const receiveMessage = (payload: any) => {
    // 检查是否是对面设备发来的消息
    if (payload.deviceId === currentDeviceId.value || !currentDeviceId.value) {
      addMessage({
        messageId: payload.messageId,
        content: payload.content,
        timestamp: payload.timestamp,
        direction: 'received',
        type: payload.type || 'text',
        status: 'delivered'
      })
    }
  }
  
  // 更新消息状态
  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    const message = messages.value.find(m => m.messageId === messageId)
    if (message) {
      message.status = status
    }
  }
  
  // 清除消息
  const clearMessages = () => {
    messages.value = []
  }
  
  // 设置当前设备
  const setCurrentDevice = (deviceId: string | null) => {
    currentDeviceId.value = deviceId
  }
  
  // 加载历史消息
  const loadHistory = async () => {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
      // TODO: 从服务器加载历史消息
      // 这里可以调用 API 获取历史消息
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟历史消息
      // const history = await fetchHistoryMessages(currentDeviceId.value)
      // messages.value = history
    } catch (error) {
      console.error('加载历史消息失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 监听 WebSocket 消息
  const initListener = () => {
    uni.$on('chat_message', (payload: any) => {
      receiveMessage(payload)
    })
  }
  
  // 移除监听
  const removeListener = () => {
    uni.$off('chat_message')
  }
  
  return {
    messages,
    currentDeviceId,
    isLoading,
    messageCount,
    currentMessages,
    addMessage,
    sendMessage,
    receiveMessage,
    updateMessageStatus,
    clearMessages,
    setCurrentDevice,
    loadHistory,
    initListener,
    removeListener
  }
})

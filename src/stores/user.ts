import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email?: string
}

export interface Device {
  id: string
  deviceId: string
  deviceName: string
  deviceType: string
  isOnline: boolean
  lastSeenAt?: number
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const apiKey = ref<string>('')
  const devices = ref<Device[]>([])
  const currentDevice = ref<Device | null>(null)
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  
  const onlineDeviceCount = computed(() => {
    return devices.value.filter(d => d.isOnline).length
  })
  
  // 设置用户信息
  const setUser = (userData: User) => {
    user.value = userData
  }
  
  // 设置 Token
  const setToken = (newToken: string) => {
    token.value = newToken
    uni.setStorageSync('token', newToken)
  }
  
  // 设置 API Key
  const setApiKey = (key: string) => {
    apiKey.value = key
    uni.setStorageSync('apiKey', key)
  }
  
  // 设置设备列表
  const setDevices = (deviceList: Device[]) => {
    devices.value = deviceList
  }
  
  // 添加设备
  const addDevice = (device: Device) => {
    const exists = devices.value.find(d => d.deviceId === device.deviceId)
    if (!exists) {
      devices.value.push(device)
    }
  }
  
  // 更新设备状态
  const updateDeviceStatus = (deviceId: string, isOnline: boolean) => {
    const device = devices.value.find(d => d.deviceId === deviceId)
    if (device) {
      device.isOnline = isOnline
      device.lastSeenAt = Date.now()
    }
  }
  
  // 移除设备
  const removeDevice = (deviceId: string) => {
    const index = devices.value.findIndex(d => d.deviceId === deviceId)
    if (index !== -1) {
      devices.value.splice(index, 1)
    }
  }
  
  // 设置当前设备
  const setCurrentDevice = (device: Device | null) => {
    currentDevice.value = device
  }
  
  // 从存储加载
  const loadFromStorage = () => {
    const savedToken = uni.getStorageSync('token')
    const savedApiKey = uni.getStorageSync('apiKey')
    const savedUser = uni.getStorageSync('user')
    
    if (savedToken) {
      token.value = savedToken
    }
    if (savedApiKey) {
      apiKey.value = savedApiKey
    }
    if (savedUser) {
      user.value = savedUser
    }
  }
  
  // 登出
  const logout = () => {
    user.value = null
    token.value = ''
    apiKey.value = ''
    devices.value = []
    currentDevice.value = null
    
    uni.removeStorageSync('token')
    uni.removeStorageSync('apiKey')
    uni.removeStorageSync('user')
  }
  
  return {
    user,
    token,
    apiKey,
    devices,
    currentDevice,
    isLoggedIn,
    onlineDeviceCount,
    setUser,
    setToken,
    setApiKey,
    setDevices,
    addDevice,
    updateDeviceStatus,
    removeDevice,
    setCurrentDevice,
    loadFromStorage,
    logout
  }
})

<template>
  <view class="index-page">
    <!-- 标题栏 -->
    <view class="header">
      <text class="title">我的设备</text>
      <text class="subtitle">{{ onlineCount }} 在线</text>
    </view>
    
    <!-- 设备列表 -->
    <scroll-view class="device-list" scroll-y>
      <view v-if="devices.length === 0" class="empty-state">
        <text class="empty-icon">🖥️</text>
        <text class="empty-text">暂无绑定设备</text>
        <text class="empty-hint">请在 OpenClaw 插件中绑定此客户端</text>
      </view>
      
      <view v-else class="device-list-content">
        <DeviceCard
          v-for="device in devices"
          :key="device.deviceId"
          :device-id="device.deviceId"
          :device-name="device.deviceName"
          :device-type="device.deviceType"
          :is-online="device.isOnline"
          @click="onDeviceClick"
        />
      </view>
    </scroll-view>
    
    <!-- 添加设备按钮 -->
    <view class="add-button" @click="showAddDeviceDialog">
      <text class="add-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DeviceCard from '@/components/DeviceCard.vue'
import { useUserStore, Device } from '@/stores/user'

const userStore = useUserStore()

const devices = computed(() => userStore.devices)
const onlineCount = computed(() => userStore.onlineDeviceCount)

// 模拟设备数据（实际应从服务器获取）
const mockDevices: Device[] = [
  {
    id: '1',
    deviceId: 'claw-desktop-001',
    deviceName: '桌面电脑',
    deviceType: 'desktop',
    isOnline: true,
    lastSeenAt: Date.now()
  },
  {
    id: '2',
    deviceId: 'claw-laptop-002',
    deviceName: 'MacBook Pro',
    deviceType: 'desktop',
    isOnline: false,
    lastSeenAt: Date.now() - 3600000
  }
]

const onDeviceClick = (deviceId: string) => {
  console.log('点击设备:', deviceId)
  // 跳转到聊天页面
  uni.switchTab({
    url: '/pages/chat/chat'
  })
}

const showAddDeviceDialog = () => {
  uni.showModal({
    title: '添加设备',
    content: '请在 OpenClaw 插件中扫描二维码绑定设备',
    showCancel: false
  })
}

const initDevices = () => {
  // 加载设备列表
  if (devices.value.length === 0) {
    userStore.setDevices(mockDevices)
  }
}

// 监听设备状态变化
const onDeviceStatusChange = (payload: any) => {
  userStore.updateDeviceStatus(payload.deviceId, payload.isOnline)
}

onMounted(() => {
  initDevices()
  uni.$on('device_status', onDeviceStatusChange)
})

onUnmounted(() => {
  uni.$off('device_status', onDeviceStatusChange)
})
</script>

<style lang="scss">
@import '@/uni.scss';

.index-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.header {
  padding: 32rpx;
  background-color: $white;
  
  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: $text-color;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: $text-secondary;
  }
}

.device-list {
  flex: 1;
  padding: 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: $text-color;
    margin-bottom: 16rpx;
  }
  
  .empty-hint {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

.add-button {
  position: fixed;
  bottom: 200rpx;
  right: 48rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 56rpx;
  background-color: $primary-color;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.4);
  
  .add-icon {
    font-size: 64rpx;
    color: $white;
    font-weight: 300;
  }
  
  &:active {
    transform: scale(0.95);
  }
}
</style>

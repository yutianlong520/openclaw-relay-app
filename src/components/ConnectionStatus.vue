<template>
  <view class="connection-status" :class="statusClass">
    <view class="status-indicator"></view>
    <text class="status-text">{{ statusText }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConnectionStore } from '@/stores/connection'

const connectionStore = useConnectionStore()

const statusClass = computed(() => {
  return connectionStore.status
})

const statusText = computed(() => {
  switch (connectionStore.status) {
    case 'connected':
      return '已连接'
    case 'connecting':
      return '连接中...'
    case 'disconnected':
      return '未连接'
    case 'error':
      return '连接错误'
    default:
      return '未知状态'
  }
})
</script>

<style lang="scss">
@import '@/uni.scss';

.connection-status {
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  font-size: 24rpx;
  
  .status-indicator {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    margin-right: 12rpx;
  }
  
  .status-text {
    color: $text-secondary;
  }
  
  &.connected {
    .status-indicator {
      background-color: $connected-color;
    }
  }
  
  &.connecting {
    .status-indicator {
      background-color: $connecting-color;
      animation: pulse 1.5s infinite;
    }
  }
  
  &.disconnected,
  &.error {
    .status-indicator {
      background-color: $disconnected-color;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>

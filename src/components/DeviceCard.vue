<template>
  <view class="device-card" @click="onClick">
    <view class="device-icon">
      <text class="icon">{{ deviceIcon }}</text>
    </view>
    <view class="device-info">
      <text class="device-name">{{ deviceName }}</text>
      <text class="device-status" :class="{ online: isOnline }">
        {{ isOnline ? '在线' : '离线' }}
      </text>
    </view>
    <view class="device-arrow">
      <text>›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface Props {
  deviceId: string
  deviceName: string
  deviceType?: string
  isOnline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  deviceType: 'desktop',
  isOnline: false
})

const emit = defineEmits<{
  (e: 'click', deviceId: string): void
}>()

const deviceIcon = computed(() => {
  switch (props.deviceType) {
    case 'mobile':
      return '📱'
    case 'tablet':
      return '📲'
    case 'desktop':
    default:
      return '💻'
  }
})

const onClick = () => {
  emit('click', props.deviceId)
}
</script>

<style lang="scss">
@import '@/uni.scss';

.device-card {
  display: flex;
  align-items: center;
  background-color: $white;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
  &:active {
    background-color: rgba(0, 0, 0, 0.02);
  }
}

.device-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 20rpx;
  background-color: $background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  
  .icon {
    font-size: 48rpx;
  }
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 32rpx;
  color: $text-color;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.device-status {
  font-size: 24rpx;
  color: $text-secondary;
  
  &.online {
    color: $success-color;
  }
}

.device-arrow {
  font-size: 40rpx;
  color: $text-secondary;
}
</style>

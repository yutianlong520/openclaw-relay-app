<template>
  <view class="message-bubble" :class="{ 'is-sent': isSent, 'is-received': !isSent }">
    <view class="bubble-content">
      <text class="message-text">{{ content }}</text>
    </view>
    <view class="message-time">
      <text>{{ formatTime(timestamp) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  content: string
  timestamp: number
  isSent: boolean
}

const props = defineProps<Props>()

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style lang="scss">
@import '@/uni.scss';

.message-bubble {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  margin: 16rpx 0;
  
  &.is-sent {
    align-self: flex-end;
    align-items: flex-end;
    
    .bubble-content {
      background-color: $sent-bg-color;
      border-radius: 24rpx 24rpx 8rpx 24rpx;
      
      .message-text {
        color: $white;
      }
    }
  }
  
  &.is-received {
    align-self: flex-start;
    align-items: flex-start;
    
    .bubble-content {
      background-color: $received-bg-color;
      border-radius: 24rpx 24rpx 24rpx 8rpx;
      
      .message-text {
        color: $text-color;
      }
    }
  }
  
  .bubble-content {
    padding: 20rpx 28rpx;
    word-break: break-word;
    line-height: 1.4;
    
    .message-text {
      font-size: 30rpx;
    }
  }
  
  .message-time {
    margin-top: 8rpx;
    padding: 0 8rpx;
    
    text {
      font-size: 20rpx;
      color: $text-secondary;
    }
  }
}
</style>

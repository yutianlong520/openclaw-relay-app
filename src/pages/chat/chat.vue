<template>
  <view class="chat-page">
    <!-- 顶部设备信息 -->
    <view class="chat-header">
      <view class="device-info">
        <text class="device-name">{{ currentDeviceName }}</text>
        <text class="connection-status" :class="{ online: isDeviceOnline }">
          {{ isDeviceOnline ? '已连接' : '未连接' }}
        </text>
      </view>
    </view>
    
    <!-- 消息列表 -->
    <ChatList ref="chatListRef" :messages="messages" @load-more="onLoadMore" />
    
    <!-- 消息输入 -->
    <ChatInput @send="onSendMessage" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import ChatList from '@/components/ChatList.vue'
import ChatInput from '@/components/ChatInput.vue'
import { useChatStore } from '@/stores/chat'
import { useConnectionStore } from '@/stores/connection'
import { useUserStore } from '@/stores/user'

const chatStore = useChatStore()
const connectionStore = useConnectionStore()
const userStore = useUserStore()

const chatListRef = ref<InstanceType<typeof ChatList> | null>(null)

const messages = computed(() => chatStore.messages)
const currentDeviceName = computed(() => userStore.currentDevice?.deviceName || '选择设备')
const isDeviceOnline = computed(() => userStore.currentDevice?.isOnline || false)

const onSendMessage = (content: string) => {
  if (!connectionStore.status === 'connected') {
    uni.showToast({
      title: '未连接到服务器',
      icon: 'none'
    })
    return
  }
  
  chatStore.sendMessage(content)
  
  // 滚动到底部
  nextTick(() => {
    chatListRef.value?.scrollToBottom()
  })
}

const onLoadMore = () => {
  // 加载更多历史消息
  chatStore.loadHistory()
}

// 监听聊天消息
const onChatMessage = (payload: any) => {
  chatStore.receiveMessage(payload)
  
  // 滚动到底部
  nextTick(() => {
    chatListRef.value?.scrollToBottom()
  })
}

onMounted(() => {
  // 初始化聊天监听
  chatStore.initListener()
  
  // 如果有当前设备，加载历史消息
  if (userStore.currentDevice) {
    chatStore.setCurrentDevice(userStore.currentDevice.deviceId)
    chatStore.loadHistory()
  }
  
  uni.$on('chat_message', onChatMessage)
})

onUnmounted(() => {
  chatStore.removeListener()
  uni.$off('chat_message', onChatMessage)
})
</script>

<style lang="scss">
@import '@/uni.scss';

.chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.chat-header {
  padding: 24rpx 32rpx;
  background-color: $white;
  border-bottom: 1rpx solid $border-color;
  
  .device-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .device-name {
    font-size: 34rpx;
    font-weight: 500;
    color: $text-color;
  }
  
  .connection-status {
    font-size: 24rpx;
    color: $text-secondary;
    
    &.online {
      color: $success-color;
    }
  }
}
</style>

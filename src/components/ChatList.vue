<template>
  <view class="chat-list-container" @click="onClickOutside">
    <scroll-view
      class="chat-list"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      @scrolltoupper="onScrollToUpper"
    >
      <view v-if="messages.length === 0" class="empty-state">
        <text class="empty-icon">💭</text>
        <text class="empty-text">暂无消息，开始聊天吧</text>
      </view>
      
      <view v-else class="messages-wrapper">
        <view 
          v-for="(message, index) in messages" 
          :key="message.id || index"
          :id="'message-' + index"
          class="message-item"
        >
          <MessageBubble
            :content="message.content"
            :timestamp="message.timestamp"
            :is-sent="message.direction === 'sent'"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, defineProps, defineEmits } from 'vue'
import MessageBubble from './MessageBubble.vue'

export interface Message {
  id?: string
  messageId?: string
  content: string
  timestamp: number
  direction: 'sent' | 'received'
  type?: 'text' | 'image' | 'voice'
}

const props = defineProps<{
  messages: Message[]
}>()

const emit = defineEmits<{
  (e: 'load-more'): void
}>()

const scrollTop = ref(0)
const scrollIntoView = ref('')

const scrollToBottom = async () => {
  await nextTick()
  if (props.messages.length > 0) {
    const lastIndex = props.messages.length - 1
    scrollIntoView.value = `message-${lastIndex}`
  }
}

const onScrollToUpper = () => {
  emit('load-more')
}

const onClickOutside = () => {
  // 收起键盘
  uni.hideKeyboard()
}

watch(() => props.messages.length, () => {
  scrollToBottom()
}, { immediate: true })

defineExpose({
  scrollToBottom
})
</script>

<style lang="scss">
@import '@/uni.scss';

.chat-list-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.chat-list {
  height: 100%;
  padding: 0 24rpx;
  box-sizing: border-box;
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
    font-size: 28rpx;
    color: $text-secondary;
  }
}

.messages-wrapper {
  padding-bottom: 32rpx;
}

.message-item {
  margin-bottom: 8rpx;
}
</style>

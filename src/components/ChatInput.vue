<template>
  <view class="chat-input-container">
    <view class="input-wrapper">
      <input
        v-model="inputText"
        class="message-input"
        type="text"
        placeholder="输入消息..."
        :adjust-position="true"
        @confirm="sendMessage"
      />
    </view>
    <view class="send-button" @click="sendMessage">
      <text class="send-icon">➤</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const inputText = ref('')

const sendMessage = () => {
  const message = inputText.value.trim()
  if (message) {
    emit('send', message)
    inputText.value = ''
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';

.chat-input-container {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: $white;
  border-top: 1rpx solid $border-color;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.input-wrapper {
  flex: 1;
  background-color: $background-color;
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
  margin-right: 16rpx;
}

.message-input {
  font-size: 30rpx;
  color: $text-color;
  height: 44rpx;
  line-height: 44rpx;
}

.send-button {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: $primary-color;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .send-icon {
    font-size: 36rpx;
    color: $white;
  }
  
  &:active {
    opacity: 0.8;
  }
}
</style>

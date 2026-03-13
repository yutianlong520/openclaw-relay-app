<template>
  <view class="app-container">
    <view class="status-bar" :class="{ 'safe-area': isX }">
      <ConnectionStatus />
    </view>
    <view class="content">
      <view class="pages">
        <view v-show="currentIndex === 0" class="page">
          <pagesIndexIndex />
        </view>
        <view v-show="currentIndex === 1" class="page">
          <pagesChatChat />
        </view>
        <view v-show="currentIndex === 2" class="page">
          <pagesSettingsSettings />
        </view>
      </view>
    </view>
    <view class="tab-bar" :class="{ 'safe-area': isX }">
      <view 
        class="tab-item" 
        :class="{ active: currentIndex === 0 }"
        @click="switchTab(0)"
      >
        <text class="icon">📱</text>
        <text class="label">设备</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentIndex === 1 }"
        @click="switchTab(1)"
      >
        <text class="icon">💬</text>
        <text class="label">聊天</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentIndex === 2 }"
        @click="switchTab(2)"
      >
        <text class="icon">⚙️</text>
        <text class="label">设置</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import pagesIndexIndex from '@/pages/index/index.vue'
import pagesChatChat from '@/pages/chat/chat.vue'
import pagesSettingsSettings from '@/pages/settings/settings.vue'
import { useConnectionStore } from '@/stores/connection'

const currentIndex = ref(0)
const isX = ref(false)
const connectionStore = useConnectionStore()

const switchTab = (index: number) => {
  currentIndex.value = index
}

onMounted(() => {
  // 检测是否为刘海屏
  const systemInfo = uni.getSystemInfoSync()
  isX.value = systemInfo.model === 'iPhone X' || 
              systemInfo.model.includes('iPhone') && 
              (systemInfo.screenHeight === 812 || systemInfo.screenHeight === 896)
  
  // 初始化连接
  connectionStore.connect()
})
</script>

<style lang="scss">
@import '@/uni.scss';

page {
  height: 100%;
  background-color: $background-color;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.status-bar {
  background-color: $white;
  border-bottom: 1rpx solid $border-color;
  
  &.safe-area {
    padding-top: 40rpx;
  }
}

.content {
  flex: 1;
  overflow: hidden;
}

.pages {
  height: 100%;
}

.page {
  height: 100%;
}

.tab-bar {
  display: flex;
  background-color: $white;
  border-top: 1rpx solid $border-color;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  
  &.safe-area {
    padding-bottom: 40rpx;
  }
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 0;
  
  .icon {
    font-size: 40rpx;
    margin-bottom: 4rpx;
  }
  
  .label {
    font-size: 24rpx;
    color: $text-secondary;
  }
  
  &.active {
    .label {
      color: $primary-color;
    }
  }
}
</style>

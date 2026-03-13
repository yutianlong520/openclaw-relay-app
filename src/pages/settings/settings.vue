<template>
  <view class="settings-page">
    <!-- 用户信息 -->
    <view class="section user-section">
      <view class="user-avatar">
        <text class="avatar-icon">👤</text>
      </view>
      <view class="user-info">
        <text class="username">{{ username || '未登录' }}</text>
        <text class="user-status">{{ isLoggedIn ? '已登录' : '点击登录' }}</text>
      </view>
      <view class="arrow" @click="goToLogin">
        <text>›</text>
      </view>
    </view>
    
    <!-- 连接设置 -->
    <view class="section">
      <view class="section-title">连接设置</view>
      
      <view class="setting-item" @click="showServerUrlDialog">
        <text class="setting-label">服务器地址</text>
        <view class="setting-value">
          <text>{{ serverUrl || '未设置' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
      
      <view class="setting-item" @click="showApiKeyDialog">
        <text class="setting-label">API Key</text>
        <view class="setting-value">
          <text>{{ apiKey ? apiKey.substring(0, 8) + '...' : '未设置' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 设备管理 -->
    <view class="section">
      <view class="section-title">设备管理</view>
      
      <view class="setting-item" @click="goToDevices">
        <text class="setting-label">已绑定设备</text>
        <view class="setting-value">
          <text>{{ deviceCount }} 个</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 关于 -->
    <view class="section">
      <view class="section-title">关于</view>
      
      <view class="setting-item">
        <text class="setting-label">版本</text>
        <view class="setting-value">
          <text>v1.0.0</text>
        </view>
      </view>
      
      <view class="setting-item" @click="openGitHub">
        <text class="setting-label">GitHub</text>
        <view class="setting-value">
          <text class="arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 登出按钮 -->
    <view v-if="isLoggedIn" class="logout-section">
      <view class="logout-button" @click="handleLogout">
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useConnectionStore } from '@/stores/connection'
import authService from '@/services/auth'

const userStore = useUserStore()
const connectionStore = useConnectionStore()

const username = computed(() => userStore.user?.username || '')
const isLoggedIn = computed(() => userStore.isLoggedIn)
const serverUrl = computed(() => connectionStore.serverUrl || uni.getStorageSync('serverUrl'))
const apiKey = computed(() => userStore.apiKey)
const deviceCount = computed(() => userStore.devices.length)

const showServerUrlDialog = () => {
  uni.showModal({
    title: '服务器地址',
    editable: true,
    placeholderText: 'wss://your-server.com/ws',
    success: (res) => {
      if (res.confirm && res.value) {
        uni.setStorageSync('serverUrl', res.value)
        // 重新连接
        connectionStore.connect(res.value)
      }
    }
  })
}

const showApiKeyDialog = () => {
  uni.showModal({
    title: 'API Key',
    editable: true,
    placeholderText: '请输入 API Key',
    success: (res) => {
      if (res.confirm && res.value) {
        userStore.setApiKey(res.value)
        // 重新认证
        connectionStore.disconnect()
        connectionStore.connect()
      }
    }
  })
}

const goToLogin = () => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
  }
}

const goToDevices = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

const openGitHub = () => {
  // #ifdef H5
  window.open('https://github.com/yutianlong520/openclaw-relay-app')
  // #endif
  
  // #ifndef H5
  uni.showToast({
    title: '请在浏览器中打开',
    icon: 'none'
  })
  // #endif
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        await authService.logout()
        uni.showToast({
          title: '已退出',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style lang="scss">
@import '@/uni.scss';

.settings-page {
  min-height: 100%;
  background-color: $background-color;
  padding-bottom: 200rpx;
}

.section {
  margin-top: 24rpx;
  background-color: $white;
  
  &.user-section {
    display: flex;
    align-items: center;
    padding: 32rpx;
    margin-top: 0;
  }
}

.section-title {
  padding: 24rpx 32rpx 16rpx;
  font-size: 26rpx;
  color: $text-secondary;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background-color: $background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  
  .avatar-icon {
    font-size: 48rpx;
  }
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .username {
    font-size: 34rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: 8rpx;
  }
  
  .user-status {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

.arrow {
  font-size: 36rpx;
  color: $text-secondary;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid $border-color;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: $background-color;
  }
  
  .setting-label {
    font-size: 30rpx;
    color: $text-color;
  }
  
  .setting-value {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: $text-secondary;
    
    .arrow {
      margin-left: 16rpx;
    }
  }
}

.logout-section {
  padding: 48rpx 32rpx;
}

.logout-button {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background-color: $white;
  border-radius: 16rpx;
  font-size: 32rpx;
  color: $error-color;
  
  &:active {
    background-color: rgba($error-color, 0.1);
  }
}
</style>

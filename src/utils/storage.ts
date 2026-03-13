/**
 * 本地存储工具
 */

export const storage = {
  /**
   * 设置值
   */
  set(key: string, value: any): void {
    try {
      uni.setStorageSync(key, value)
    } catch (error) {
      console.error(`存储失败 [${key}]:`, error)
    }
  },
  
  /**
   * 获取值
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = uni.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (error) {
      console.error(`读取失败 [${key}]:`, error)
      return defaultValue
    }
  },
  
  /**
   * 移除值
   */
  remove(key: string): void {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error(`移除失败 [${key}]:`, error)
    }
  },
  
  /**
   * 清空所有
   */
  clear(): void {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('清空存储失败:', error)
    }
  },
  
  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    try {
      const value = uni.getStorageSync(key)
      return value !== ''
    } catch (error) {
      return false
    }
  },
  
  /**
   * 获取存储信息
   */
  getInfo(): { currentSize: number; keys: string[] } {
    try {
      const info = uni.getStorageInfoSync()
      return {
        currentSize: info.currentSize,
        keys: info.keys
      }
    } catch (error) {
      return { currentSize: 0, keys: [] }
    }
  }
}

export default storage

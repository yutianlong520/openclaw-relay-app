/**
 * 日志工具
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogOptions {
  level?: LogLevel
  tag?: string
  time?: boolean
}

class Logger {
  private tag: string = 'App'
  private enableDebug: boolean = true
  
  constructor(tag?: string) {
    if (tag) {
      this.tag = tag
    }
    
    // 在开发环境开启调试
    #ifndef H5
    this.enableDebug = true
    #endif
  }
  
  private formatMessage(message: any, options: LogOptions): string {
    const parts: string[] = []
    
    if (options.time !== false) {
      const now = new Date()
      const time = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      parts.push(`[${time}]`)
    }
    
    if (options.tag || this.tag) {
      parts.push(`[${options.tag || this.tag}]`)
    }
    
    if (options.level) {
      parts.push(`[${options.level.toUpperCase()}]`)
    }
    
    parts.push(typeof message === 'object' ? JSON.stringify(message) : String(message))
    
    return parts.join(' ')
  }
  
  debug(message: any, ...args: any[]): void {
    if (!this.enableDebug) return
    
    const formatted = this.formatMessage(message, { level: 'debug' })
    console.debug(formatted, ...args)
  }
  
  info(message: any, ...args: any[]): void {
    const formatted = this.formatMessage(message, { level: 'info' })
    console.info(formatted, ...args)
  }
  
  warn(message: any, ...args: any[]): void {
    const formatted = this.formatMessage(message, { level: 'warn' })
    console.warn(formatted, ...args)
  }
  
  error(message: any, ...args: any[]): void {
    const formatted = this.formatMessage(message, { level: 'error' })
    console.error(formatted, ...args)
  }
  
  /**
   * 创建子日志实例
   */
  create(tag: string): Logger {
    return new Logger(`${this.tag}:${tag}`)
  }
  
  /**
   * 开启/关闭调试
   */
  setDebug(enable: boolean): void {
    this.enableDebug = enable
  }
}

// 导出默认实例
export const logger = new Logger('OpenClaw')
export default logger

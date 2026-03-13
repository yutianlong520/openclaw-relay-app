/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare const uni: UniApp.Uni

interface UniApp {
  connectSocket(options: UniApp.ConnectSocketOptions): UniApp.SocketTask
  onSocketOpen(callback: (res: any) => void): void
  onSocketMessage(callback: (res: any) => void): void
  onSocketError(callback: (res: any) => void): void
  onSocketClose(callback: (res: any) => void): void
  sendSocketMessage(options: UniApp.SendSocketMessageOptions): void
  closeSocket(): void
}

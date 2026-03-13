/**
 * 加密工具
 * 提供消息加密/解密功能（可选的 E2EE 端到端加密）
 */

// 生成随机字符串
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 生成 UUID
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Base64 编码
export function base64Encode(str: string): string {
  try {
    return uni.arrayBufferToBase64(uni.base64ToArrayBuffer(str))
  } catch {
    return btoa(encodeURIComponent(str))
  }
}

// Base64 解码
export function base64Decode(str: string): string {
  try {
    return uni.arrayBufferToBase64(uni.base64ToArrayBuffer(str))
  } catch {
    return decodeURIComponent(atob(str))
  }
}

// SHA-256 哈希
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 简单的 XOR 加密（仅用于演示，生产环境请使用标准加密库）
export function xorEncrypt(message: string, key: string): string {
  let result = ''
  for (let i = 0; i < message.length; i++) {
    result += String.fromCharCode(message.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return base64Encode(result)
}

// XOR 解密
export function xorDecrypt(encrypted: string, key: string): string {
  const decoded = base64Decode(encrypted)
  let result = ''
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

const cryptoUtil = {
  generateRandomString,
  generateUUID,
  base64Encode,
  base64Decode,
  sha256,
  xorEncrypt,
  xorDecrypt
}

export default cryptoUtil

"use client";

import { io, Socket } from "socket.io-client";

// 創建一個單例的 Socket 實例
class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();

  private constructor() {
    // 私有構造函數，確保單例模式
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // 初始化 Socket 連接
  public connect(): Socket {
    if (!this.socket) {
      // 確保只創建一個 socket 實例
      this.socket = io({
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // 添加基本事件監聽
      this.socket.on("connect", () => {
        console.log("Socket 已連接，ID:", this.socket?.id);
        this.emitToListeners("connect", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket 已斷開連接，原因:", reason);
        this.emitToListeners("disconnect", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket 連接錯誤:", error.message);
        this.emitToListeners("connect_error", error);
      });
    }

    return this.socket;
  }

  // 添加事件監聽器
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    // 如果 socket 已存在，直接添加監聽器
    if (this.socket) {
      this.socket.on(event, (...args: any[]) => {
        callback(...args);
      });
    }
  }

  // 移除事件監聽器
  public off(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback);
    }

    // 如果 socket 已存在，移除監聽器
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // 發送事件
  public emit(event: string, ...args: any[]): void {
    if (this.socket) {
      this.socket.emit(event, ...args);
    } else {
      console.warn("嘗試在 socket 未連接時發送事件:", event);
    }
  }

  // 斷開連接
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 通知所有監聽器
  private emitToListeners(event: string, ...args: any[]): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach((callback) => {
        callback(...args);
      });
    }
  }

  // 獲取 socket 實例
  public getSocket(): Socket | null {
    return this.socket;
  }

  // 檢查連接狀態
  public isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

// 導出單例實例
export const socketService = SocketService.getInstance();

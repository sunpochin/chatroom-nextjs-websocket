"use client";

import { useEffect } from "react";

export default function SocketInitializer() {
  useEffect(() => {
    // 啟動 WebSocket 伺服器
    const initializeSocket = async () => {
      try {
        const response = await fetch("/api/socket");
        const data = await response.text();
        console.log("Socket 伺服器初始化結果:", data);
      } catch (err) {
        console.error("初始化 Socket 伺服器時出錯:", err);
        // 如果初始化失敗，1秒後重試
        setTimeout(initializeSocket, 1000);
      }
    };

    initializeSocket();
  }, []);

  // 這是一個純功能性組件，不需要渲染任何內容
  return null;
}

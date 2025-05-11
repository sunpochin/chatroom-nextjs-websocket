// 這裡是基本的 Socket API 路由
// 這個檔案將來會用於實現 WebSocket 後端

import { NextRequest } from "next/server";
import { Server as ServerIO, Socket } from "socket.io";
import { Message } from "@/types";

// 用於存儲全局的 Socket.io 伺服器實例
let io: ServerIO;

export async function GET(request: NextRequest) {
  // 如果已經有伺服器實例，直接回應成功
  if (io) {
    return new Response("WebSocket 伺服器已啟動", { status: 200 });
  }

  try {
    // 取得 Node.js 伺服器實例
    const res = new Response("WebSocket 伺服器初始化中...");
    const server = (res as any).socket?.server;

    // 如果没有服務器實例，初始化一個新的 Socket.io 伺服器
    if (!server?.io) {
      console.log("正在啟動 Socket.io 伺服器...");

      // 注意：這裡不要設置 path，讓 Socket.IO 使用默認路徑
      io = new ServerIO(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });

      // 儲存 io 實例到服務器
      server.io = io;

      // 監聽连接事件
      io.on("connection", (socket: Socket) => {
        console.log(`用戶已連接: ${socket.id}`);

        // 向新連接的用戶發送歡迎消息
        socket.emit("message", {
          id: Date.now().toString(),
          text: "歡迎加入聊天室！",
          username: "系統",
          timestamp: Date.now(),
          isSent: false,
        });

        // 監聽用戶發送的消息
        socket.on("message", (message: Partial<Message>) => {
          console.log("收到消息:", message);
          // 廣播消息給所有連接的客戶端（包括發送者）
          io.emit("message", {
            ...message,
            id: Date.now().toString(),
            timestamp: Date.now(),
          });
        });

        // 監聽用戶加入聊天室事件
        socket.on("user_joined", (username: string) => {
          console.log(`用戶加入: ${username}`);
          // 廣播用戶加入通知
          io.emit("message", {
            id: Date.now().toString(),
            text: `${username} 加入了聊天室`,
            username: "系統",
            timestamp: Date.now(),
            isSent: false,
          });
        });

        // 監聽斷開連接事件
        socket.on("disconnect", () => {
          console.log(`用戶已斷開連接: ${socket.id}`);
        });
      });
    }

    return new Response("WebSocket 伺服器已啟動", { status: 200 });
  } catch (err) {
    console.error("WebSocket 伺服器啟動錯誤:", err);
    return new Response("WebSocket 伺服器啟動失敗", { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ status: "Socket API 已接收訊息" });
}

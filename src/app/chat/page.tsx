"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Socket } from "socket.io-client";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import UserInfo from "@/components/UserInfo";
import { Message } from "@/types";
import { socketService } from "@/lib/socketService";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 初始化 WebSocket 連接
  useEffect(() => {
    // 首先啟動伺服器
    fetch("/api/socket");

    // 初始化 socket 連接
    const socket = socketService.connect();

    // 設置連接事件監聽
    const handleConnect = () => {
      console.log("聊天室已連接到 WebSocket 伺服器");
      setIsConnected(true);

      // 如果用戶名已設置，發送加入事件
      if (username) {
        socket.emit("user_joined", username);
      }
    };

    // 設置斷開連接事件監聽
    const handleDisconnect = () => {
      console.log("聊天室與 WebSocket 伺服器斷開連接");
      setIsConnected(false);
    };

    // 設置消息接收事件監聽
    const handleMessage = (message: Message) => {
      console.log("聊天室收到消息:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // 添加事件監聽器
    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);
    socketService.on("message", handleMessage);

    // 檢查當前連接狀態
    setIsConnected(socketService.isConnected());

    // 組件卸載時移除事件監聽器
    return () => {
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
      socketService.off("message", handleMessage);
    };
  }, [username]);

  // 發送消息
  const sendMessage = (text: string) => {
    if (text.trim() && username && isConnected) {
      const messageData = {
        text,
        username,
        isSent: true,
      };

      // 通過 WebSocket 發送消息
      socketService.emit("message", messageData);
    }
  };

  // 設置用戶名
  const setUsernameFn = (name: string) => {
    if (name.trim()) {
      setUsername(name);
      setIsUsernameSet(true);

      // 如果已連接，發送用戶加入事件
      if (isConnected) {
        socketService.emit("user_joined", name);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh]">
      <header className="p-4 border-b">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-500 hover:underline"
          >
            ← 返回首頁
          </Link>
          <h1 className="text-2xl font-bold text-center">即時聊天室</h1>
          <div className="w-24 flex justify-end">
            {isConnected ? (
              <span className="text-green-500 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                已連接
              </span>
            ) : (
              <span className="text-red-500 text-sm flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                未連接
              </span>
            )}
          </div>
        </div>
      </header>

      {!isUsernameSet ? (
        <UserInfo setUsername={setUsernameFn} />
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatMessages
            messages={messages}
            currentUser={username}
          />
          <ChatInput sendMessage={sendMessage} />
        </div>
      )}
    </div>
  );
}

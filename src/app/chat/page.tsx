"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import UserInfo from "@/components/UserInfo";
import { Message } from "@/types";

export default function ChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);

  // 連接 WebSocket
  useEffect(() => {
    // 這裡我們只是示例，實際上需要一個真正的 WebSocket 伺服器
    // 當後端準備好時，這裡會使用正確的 URL

    // 模擬消息接收，在實際開發中會被真正的 WebSocket 通信替代
    const mockMessages = [
      {
        id: "1",
        text: "歡迎來到聊天室！",
        username: "系統",
        timestamp: Date.now(),
        isSent: false,
      },
    ];

    setMessages(mockMessages);

    // 在實際應用中，我們會連接到真正的 WebSocket 伺服器
    // const socket = io();
    // setSocket(socket);

    // socket.on("receive_message", (message) => {
    //   setMessages((prevMessages) => [...prevMessages, { ...message, isSent: false }]);
    // });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  // 發送消息
  const sendMessage = (text: string) => {
    if (text.trim() && username) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        username,
        timestamp: Date.now(),
        isSent: true,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 在實際應用中，我們會通過 WebSocket 發送消息
      // if (socket) {
      //   socket.emit("send_message", {
      //     text,
      //     username,
      //     timestamp: Date.now()
      //   });
      // }

      // 模擬回覆（在實際應用中不需要）
      setTimeout(() => {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `收到你的消息: "${text}"`,
          username: "系統回覆",
          timestamp: Date.now() + 1,
          isSent: false,
        };
        setMessages((prevMessages) => [...prevMessages, replyMessage]);
      }, 1000);
    }
  };

  // 設置用戶名
  const setUsernameFn = (name: string) => {
    if (name.trim()) {
      setUsername(name);
      setIsUsernameSet(true);

      // 添加一條系統消息
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: `${name} 加入了聊天室`,
        username: "系統",
        timestamp: Date.now(),
        isSent: false,
      };

      setMessages((prevMessages) => [...prevMessages, systemMessage]);
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
          <div className="w-24"></div> {/* 占位元素，保持標題居中 */}
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

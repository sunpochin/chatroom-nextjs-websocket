"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";

interface ChatMessagesProps {
  messages: Message[];
  currentUser: string;
}

export default function ChatMessages({
  messages,
  currentUser,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 格式化時間
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.username === currentUser;
        const isSystem = message.username === "系統";

        // 系統消息居中顯示
        if (isSystem) {
          return (
            <div
              key={message.id}
              className="flex flex-col items-center my-2"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {message.text}
              </div>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`flex flex-col ${
              isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center mb-1 space-x-2">
              <span className="text-sm font-medium">{message.username}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
            <div
              className={`chat-bubble ${isCurrentUser ? "sent" : "received"}`}
            >
              {message.text}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

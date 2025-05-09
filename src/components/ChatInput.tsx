"use client";

import { useState, FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  sendMessage: (message: string) => void;
}

export default function ChatInput({ sendMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-3 bg-white dark:bg-gray-800 sticky bottom-0"
    >
      <div className="flex items-end gap-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="輸入訊息..."
          className="flex-1 border rounded-lg p-2 h-12 max-h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg px-4 py-2 font-medium transition-colors"
        >
          發送
        </button>
      </div>
    </form>
  );
}

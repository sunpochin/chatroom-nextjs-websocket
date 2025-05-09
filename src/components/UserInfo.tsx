"use client";

import { useState, FormEvent } from "react";

interface UserInfoProps {
  setUsername: (username: string) => void;
}

export default function UserInfo({ setUsername }: UserInfoProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError("請輸入您的名稱");
      return;
    }

    if (inputValue.length > 20) {
      setError("名稱不能超過20個字符");
      return;
    }

    setUsername(inputValue);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">加入聊天室</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 font-medium"
            >
              您的名稱
            </label>
            <input
              type="text"
              id="username"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder="請輸入您的名稱"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              autoFocus
            />
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            加入聊天室
          </button>
        </form>
      </div>
    </div>
  );
}

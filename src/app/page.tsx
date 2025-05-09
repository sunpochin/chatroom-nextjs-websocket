"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">
        歡迎來到即時聊天室
      </h1>
      <p className="text-xl text-center mb-8 max-w-2xl">
        這是一個使用 Next.js 和 WebSocket 技術構建的即時聊天應用程式。
        體驗流暢的即時通訊，開始與朋友或同事交流吧！
      </p>
      <div className="flex gap-4">
        <Link
          href="/chat"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          進入聊天室
        </Link>
      </div>
    </div>
  );
}

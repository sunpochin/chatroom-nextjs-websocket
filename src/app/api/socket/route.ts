// 這裡是基本的 Socket API 路由
// 這個檔案將來會用於實現 WebSocket 後端

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "Socket API 準備就緒" });
}

export async function POST() {
  return NextResponse.json({ status: "Socket API 已接收訊息" });
}

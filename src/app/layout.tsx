import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SocketInitializer from "@/components/SocketInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "即時聊天室 | Next.js WebSocket",
  description: "使用 Next.js 和 WebSocket 構建的即時聊天應用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <SocketInitializer />
        <main className="max-w-screen-md mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import TanstackProvider from "@/providers/TanstackProvider";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MEDI MATCH",
  description: "약 검색 및 추천 서비스로 필요한 의약품을 쉽게 찾아보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        <TanstackProvider>{children}</TanstackProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

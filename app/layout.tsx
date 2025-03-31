import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

export const pretendard = localFont({
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
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}

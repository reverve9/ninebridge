import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "나인브릿지 | Nine Bridge - 연결을 디자인합니다",
  description: "웹/앱 개발, 행사기획, 마케팅, 영상제작. 나인브릿지가 당신의 비즈니스를 연결합니다.",
  keywords: ["나인브릿지", "웹개발", "앱개발", "행사기획", "마케팅", "라이브커머스", "영상제작", "강릉"],
  authors: [{ name: "Nine Bridge Co., Ltd." }],
  openGraph: {
    title: "나인브릿지 | Nine Bridge",
    description: "연결을 디자인합니다 - 웹/앱 개발, 행사기획, 마케팅, 영상제작",
    url: "https://ninebridge.co.kr",
    siteName: "나인브릿지",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

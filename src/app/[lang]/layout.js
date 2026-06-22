import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata = {
  title: "Hung Trinh AI - Đào tạo & Chuyển giao AI",
  description: "Nâng tầm năng lực doanh nghiệp và cá nhân thông qua việc làm chủ công nghệ trí tuệ nhân tạo. Giải pháp tinh gọn, hiệu quả và đón đầu xu hướng toàn cầu.",
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  return (
    <html
      lang={lang}
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" precedence="default" />
      </head>
      <body className="min-h-full flex flex-col font-body-lg text-ink-text bg-mist-bg">
        {children}
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO & OGP 設定
export const metadata = {
  title: "今日の運勢・無料占い | 星座ランキング",
  description: "毎日更新！12星座の運勢ランキングと無料占い。恋愛運・金運・仕事運をチェック！",
  openGraph: {
    title: "今日の運勢・無料占い | 星座ランキング",
    description: "毎日更新！12星座の運勢ランキングと無料占い。恋愛運・金運・仕事運をチェック！",
    url: "https://your-site.vercel.app/", // 🔹 自分のVercel URLに変更！
    type: "website",
    images: [
      {
        url: "https://your-site.vercel.app/og-image.png", // 🔹 OGP画像（後で作る）
        width: 1200,
        height: 630,
        alt: "今日の運勢・12星座占い",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "今日の運勢・無料占い | 星座ランキング",
    description: "毎日更新！12星座の運勢ランキングと無料占い。恋愛運・金運・仕事運をチェック！",
    images: ["https://your-site.vercel.app/og-image.png"], // 🔹 OGP画像
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja"> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

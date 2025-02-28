
"use client"; // ✅ クライアントコンポーネントとして指定

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HoroscopeDetailPage() {
  const params = useParams();
  const sign = decodeURIComponent(params.sign);
  const [horoscope, setHoroscope] = useState("読み込み中...");

  useEffect(() => {
    async function fetchHoroscope() {
      try {
        // 🔹 `horoscope.json` を取得
        const res = await fetch("/horoscope.json");
        
        if (!res.ok) {
          throw new Error("データを取得できませんでした！");
        }

        const data = await res.json();
        setHoroscope(data[sign] || "今日の運勢は取得できませんでした。");
      } catch (error) {
        console.error("❌ 占いデータ取得エラー:", error);
        setHoroscope("占いデータを取得できませんでした。");
      }
    }
    
    fetchHoroscope();
  }, [sign]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">{sign}の運勢</h1>
      <p className="mt-4 text-lg">{horoscope}</p>
    </div>
  );
}

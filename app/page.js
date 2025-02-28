"use client"; // ✅ クライアントコンポーネント

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ⭐️ 星座情報（画像と日付を持つ）
const zodiacData = {
  "おひつじ座": { image: "/aries.png", date: "3/21-4/19" },
  "おうし座": { image: "/taurus.png", date: "4/20-5/20" },
  "ふたご座": { image: "/gemini.png", date: "5/21-6/21" },
  "かに座": { image: "/cancer.png", date: "6/22-7/22" },
  "しし座": { image: "/leo.png", date: "7/23-8/22" },
  "おとめ座": { image: "/virgo.png", date: "8/23-9/22" },
  "てんびん座": { image: "/libra.png", date: "9/23-10/22" },
  "さそり座": { image: "/scorpio.png", date: "10/23-11/21" },
  "いて座": { image: "/sagittarius.png", date: "11/22-12/21" },
  "やぎ座": { image: "/capricorn.png", date: "12/22-1/19" },
  "みずがめ座": { image: "/aquarius.png", date: "1/20-2/18" },
  "うお座": { image: "/pisces.png", date: "2/19-3/20" },
};

// ⭐️ 星座ランキングコンポーネント（`ranking.json` を読み込む）
function ZodiacRankings() {
  const [rankings, setRankings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await fetch("/ranking.json");
        if (!res.ok) throw new Error("ランキングデータが取得できませんでした");
        const data = await res.json();
        setRankings(data);
      } catch (error) {
        console.error("❌ ランキングデータ取得エラー:", error);
        setRankings(Object.keys(zodiacData));
      }
    }
    fetchRanking();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rankings.map((sign, index) => (
        <div key={sign} className="p-4 shadow-lg border rounded-lg">
          <div className="flex items-center space-x-4">
            <img src={zodiacData[sign]?.image} alt={sign} className="w-16 h-16" />
            <div>
              <h2 className="text-lg font-semibold">{sign}</h2>
              <p className="text-sm">{zodiacData[sign]?.date}</p>
              <p className="text-sm font-bold">{index + 1}位</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => router.push(`/horoscope/${sign}`)}
              >
                続きを読む
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ⭐️ 人生相談チャットコンポーネント（履歴保存機能つき）
function ChatComponent() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);

  // 🔹 ページが読み込まれたら履歴を localStorage から取得
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("chatHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResponse(data.answer);

      // 🔹 新しい履歴を追加
      const newHistory = [{ question, answer: data.answer }, ...history];
      setHistory(newHistory);

      // 🔹 localStorage に履歴を保存
      if (typeof window !== "undefined") {
        localStorage.setItem("chatHistory", JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error("❌ チャット送信エラー:", error);
    }

    setQuestion(""); // 🔹 入力欄をリセット
  };

  // 🔹 履歴を削除する関数
  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatHistory");
    }
  };

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold">人生相談・アドバイス</h2>
      <input
        type="text"
        className="w-full p-2 border rounded mt-2"
        placeholder="悩みを入力してください..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAsk}>
        質問する
      </button>
      {response && <p className="mt-4 p-2 bg-gray-100 rounded">{response}</p>}

      {/* 🔹 過去の相談履歴を表示 */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">過去の相談履歴</h3>
        {history.length === 0 ? (
          <p className="text-gray-500">履歴がありません</p>
        ) : (
          <ul className="space-y-2">
            {history.map((entry, index) => (
              <li key={index} className="p-2 bg-gray-50 border rounded">
                <p className="font-semibold">Q: {entry.question}</p>
                <p className="text-sm">A: {entry.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 履歴を削除するボタン */}
      {history.length > 0 && (
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={clearHistory}>
          履歴を削除
        </button>
      )}
    </div>
  );
}

// ⭐️ `Home` コンポーネント（統合版）
export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">今日の星座ランキング</h1>
      <ZodiacRankings />
      <ChatComponent />
    </div>
  );
}



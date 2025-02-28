

import fetch from "node-fetch";
import fs from "fs/promises"; // ✅ ファイルを保存するために必要
import path from "path";

// APIのURL（Next.jsが3002番ポートで動いてる）
const API_URL = "http://localhost:3002/api/generateHoroscope";

// `public/horoscope.json` & `public/ranking.json` のパスを設定
const horoscopeFilePath = path.join(process.cwd(), "public", "horoscope.json");
const rankingFilePath = path.join(process.cwd(), "public", "ranking.json");

// 星座リスト
const zodiacSigns = [
  "おひつじ座", "おうし座", "ふたご座", "かに座",
  "しし座", "おとめ座", "てんびん座", "さそり座",
  "いて座", "やぎ座", "みずがめ座", "うお座"
];

async function updateHoroscopeAndRanking() {
  try {
    console.log("🔄 占いデータを取得中...");
    const response = await fetch(API_URL);

    // レスポンスをテキストで取得
    const text = await response.text();

    try {
      // JSONデータに変換
      const horoscopeData = JSON.parse(text);
      console.log("✅ 今日の占いを更新しました！", horoscopeData);

      // 🔹 `horoscope.json` を `public/` に保存！
      await fs.writeFile(horoscopeFilePath, JSON.stringify(horoscopeData, null, 2), "utf-8");
      console.log(`📁 占いデータを ${horoscopeFilePath} に保存しました！`);

      // ⭐ ランキングをランダムに並び替える
      const shuffledRanking = [...zodiacSigns].sort(() => 0.5 - Math.random());

      // 🔹 `ranking.json` を `public/` に保存！
      await fs.writeFile(rankingFilePath, JSON.stringify(shuffledRanking, null, 2), "utf-8");
      console.log(`📁 星座ランキングを ${rankingFilePath} に保存しました！`);

    } catch (jsonError) {
      console.error("❌ JSONパースエラー！APIのレスポンス:", text);
    }

  } catch (error) {
    console.error("❌ 占いの自動更新に失敗しました:", error);
  }
}

// 実行
updateHoroscopeAndRanking();

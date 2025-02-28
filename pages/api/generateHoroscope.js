import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ 環境変数からAPIキーを取得
});

// 星座のリスト
const zodiacSigns = [
  "おひつじ座", "おうし座", "ふたご座", "かに座",
  "しし座", "おとめ座", "てんびん座", "さそり座",
  "いて座", "やぎ座", "みずがめ座", "うお座"
];

// ファイルの保存パス
const filePath = path.join(process.cwd(), "public", "horoscope.json");

// 星座ごとの占いを生成
async function generateHoroscope() {
  let horoscopes = {};

  for (const sign of zodiacSigns) {
    try {
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // ✅ 必要なら gpt-4 に変更
        messages: [{ role: "system", content: `今日の${sign}の運勢を200文字程度で教えてください。` }],
      });

      horoscopes[sign] = chatResponse.choices[0].message.content;
    } catch (error) {
      console.error(`エラー: ${sign} の占い生成に失敗しました`, error);
      horoscopes[sign] = "今日の運勢を取得できませんでした。";
    }
  }

  // JSONファイルに保存
  await fs.writeFile(filePath, JSON.stringify(horoscopes, null, 2), "utf-8");

  return horoscopes;
}

// APIエンドポイント（手動実行用）
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const horoscopes = await generateHoroscope();
  res.status(200).json(horoscopes);
}

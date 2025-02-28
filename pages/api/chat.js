import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ 環境変数からAPIキーを取得
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { question } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ モデルを選択（必要なら gpt-4 に変更）
      messages: [{ role: "user", content: question }],
    });

    const answer = chatResponse.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error("ChatGPT API Error:", error);
    res.status(500).json({ answer: "エラーが発生しました。もう一度試してください。" });
  }
}

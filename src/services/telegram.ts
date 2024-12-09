import dotenv from "dotenv";

dotenv.config();

export async function sendTelegramMessage(message: string) {
  const BOT_TOKEN = process.env.BOT_TOKEN as string;
  const CHAT_ID = process.env.CHAT_ID as string;

  console.log("*** bot token", BOT_TOKEN);
  console.log("*** chat id", CHAT_ID);

  const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Telegram API error: ${errorBody}`);
    }

    console.log("Message sent successfully.");
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}

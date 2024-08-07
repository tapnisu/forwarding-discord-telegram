import dotenv from "dotenv";

export interface Env {
  DISCORD_TOKEN: string;
  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  TELEGRAM_TOPIC_ID: string;
}

export function getEnv(): Env {
  if (process.env.NODE_ENV != "production") dotenv.config();

  return process.env as unknown as Env;
}

import dotenv from "dotenv";
import { BotType } from "./senderBot.js";

export enum BotBackend {
  Selfbot = "selfbot",
  Bot = "bot"
}

export interface Env {
  DISCORD_TOKEN: string;
  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  TELEGRAM_TOPIC_ID?: string;
  DISCORD_BOT_BACKEND?: BotBackend;
  OUTPUT_BACKEND?: BotType;
  DISCORD_WEBHOOK_URL?: string;
}

export function getEnv(): Env {
  if (process.env.NODE_ENV != "production") dotenv.config();

  process.env.OUTPUT_BACKEND = process.env.OUTPUT_BACKEND ?? BotType.Telegram;
  process.env.DISCORD_BOT_BACKEND =
    process.env.DISCORD_BOT_BACKEND ?? BotBackend.Selfbot;

  return process.env as unknown as Env;
}

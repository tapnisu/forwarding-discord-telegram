import dotenv from "dotenv";
import { ChannelId } from "./config";

export interface Env {
  DISCORD_TOKEN: string;
  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: ChannelId;
}

export function getEnv(): Env {
  if (process.env.NODE_ENV != "production") dotenv.config();

  return process.env as unknown as Env;
}

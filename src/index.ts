import { Bot } from "./bot.js";
import { getConfig } from "./config.js";
import { getEnv } from "./env.js";
import { SenderBot } from "./senderBot.js";

const env = getEnv();
const config = getConfig();

const channelsToSend = config.outputChannels ?? [];
if (env.TELEGRAM_CHAT_ID) channelsToSend.unshift(env.TELEGRAM_CHAT_ID);

const client = new Bot(
  config,
  new SenderBot(env.TELEGRAM_TOKEN, channelsToSend, config.disableLinkPreview)
);

client.login(env.DISCORD_TOKEN);

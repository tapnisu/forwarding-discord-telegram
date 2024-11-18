import { Bot } from "./bot.js";
import { getConfig } from "./config.js";
import { getEnv } from "./env.js";
import { SenderBot } from "./senderBot.js";

const env = getEnv();
const config = await getConfig();

const channelsToSend = config.outputChannels ?? [];
if (env.TELEGRAM_CHAT_ID) channelsToSend.unshift(env.TELEGRAM_CHAT_ID);

const senderBot = new SenderBot(
  env.TELEGRAM_TOKEN,
  channelsToSend,
  config.disableLinkPreview,
  null,
  env.TELEGRAM_TOPIC_ID ? Number(env.TELEGRAM_TOPIC_ID) : null
);

senderBot.api
  .getMe()
  .then((me) => console.log(`Logged into Telegram as @${me.username}`));

const client = new Bot(config, senderBot);

client.login(env.DISCORD_TOKEN);

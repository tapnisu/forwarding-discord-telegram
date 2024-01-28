import { Bot } from "./bot";
import { getConfig } from "./config";
import { getEnv } from "./env";
import { SenderBot } from "./senderBot";

const env = getEnv();
const config = getConfig();

let channelsToSend = config.outputChannels ?? [];
if (env.TELEGRAM_CHAT_ID)
	channelsToSend = [env.TELEGRAM_CHAT_ID, ...channelsToSend];

const client = new Bot(
	config,
	new SenderBot(
		env.TELEGRAM_CHAT_ID.toString(),
		channelsToSend,
		config.disableLinkPreview
	)
);

client.login(env.DISCORD_TOKEN);

import { existsSync, readFileSync, writeFileSync } from "fs";

export type ChannelId = number | string;

export interface ChannelConfig {
	muted: ChannelId[];
	allowed: ChannelId[];
}

export interface Config {
	outputChannels?: ChannelId[];
	mutedGuildsIds?: ChannelId[];
	allowedGuildsIds?: ChannelId[];
	mutedChannelsIds?: ChannelId[];
	allowedChannelsIds?: ChannelId[];
	allowedUsersIds?: ChannelId[];
	mutedUsersIds?: ChannelId[];
	channelConfigs?: Record<string, ChannelConfig>;
	showDate?: boolean;
	showChat?: boolean;
	stackMessages?: boolean;
}

export function getConfig() {
	if (!existsSync("./config.json"))
		writeFileSync("./config.json", JSON.stringify({}));

	const config: Config = JSON.parse(readFileSync("./config.json").toString());

	return config;
}

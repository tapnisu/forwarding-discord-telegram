import { existsSync, readFileSync, writeFileSync } from "fs";

export type ChannelId = number | string;
export type ChannelsIds = ChannelId[];

export interface ChannelConfig {
	muted: ChannelsIds;
	allowed: ChannelsIds;
}

export interface ChannelConfigs {
	[k: string]: ChannelConfig;
}

export interface Config {
	outputChannels?: ChannelsIds;
	mutedGuildsIds?: ChannelsIds;
	allowedGuildsIds?: ChannelsIds;
	mutedChannelsIds?: ChannelsIds;
	allowedChannelsIds?: ChannelsIds;
	allowedUsersIds?: ChannelsIds;
	mutedUsersIds?: ChannelsIds;
	channelConfigs?: ChannelConfigs;
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

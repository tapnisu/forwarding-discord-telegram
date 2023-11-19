import { readFileSync } from "fs";

export interface Config {
	outputChannels: number[];
	mutedGuildsIds: number[];
	allowedGuildsIds: number[];
	mutedChannelsIds: number[];
	allowedChannelsIds: number[];
	allowedUsersIds: number[];
	mutedUsersIds: number[];
}

export function getConfig() {
	const config: Config = JSON.parse(readFileSync("./config.json").toString());

	return config;
}

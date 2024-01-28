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
  disableLinkPreview: boolean;
  imagesAsMedia?: boolean;
  showDate?: boolean;
  showChat?: boolean;
  stackMessages?: boolean;
}

export function getConfig(): Config {
  if (!existsSync("./config.json"))
    writeFileSync("./config.json", JSON.stringify({}));

  return JSON.parse(readFileSync("./config.json").toString());
}

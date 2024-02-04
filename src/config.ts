import { existsSync, readFileSync, writeFileSync } from "fs";

export type ChannelId = number | string;
export type ChatId = ChannelId;

export interface ChannelConfig {
  muted: ChannelId[];
  allowed: ChannelId[];
}

export interface Config {
  outputChannels?: ChatId[];
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
    writeFileSync(
      "./config.json",
      JSON.stringify({
        outputChannels: [],
        mutedGuildsIds: [],
        allowedGuildsIds: [],
        mutedChannelsIds: [],
        allowedChannelsIds: [],
        allowedUsersIds: [],
        mutedUsersIds: [],
        channelConfigs: {},
        disableLinkPreview: false,
        imagesAsMedia: true,
        showDate: true,
        showChat: true,
        stackMessages: false
      })
    );

  return JSON.parse(readFileSync("./config.json").toString());
}

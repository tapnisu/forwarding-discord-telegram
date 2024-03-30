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
  showMessageDeletions?: boolean;
  showMessageUpdates?: boolean;
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

  const config: Config = JSON.parse(readFileSync("./config.json").toString());

  config.outputChannels?.forEach((id) => testIDType(id));
  config.mutedGuildsIds?.forEach((id) => testIDType(id));
  config.allowedGuildsIds?.forEach((id) => testIDType(id));
  config.mutedChannelsIds?.forEach((id) => testIDType(id));
  config.allowedChannelsIds?.forEach((id) => testIDType(id));
  config.allowedUsersIds?.forEach((id) => testIDType(id));
  config.mutedUsersIds?.forEach((id) => testIDType(id));

  Object.keys(config.channelConfigs).forEach((key) => {
    config.channelConfigs[key].allowed?.forEach((id) => testIDType(id));

    config.channelConfigs[key].muted?.forEach((id) => testIDType(id));
  });

  return config;
}

export function testIDType(id: ChannelId) {
  if (typeof id != "string")
    console.warn(
      `${id} is not a string! This could lead to errors when matching ids. Please input strings in "${id}" format (with quotes)`
    );
}

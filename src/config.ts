import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import prettier from "prettier";

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

export async function getConfig(): Promise<Config> {
  if (!existsSync("./config.json")) {
    const defaultConfig = JSON.stringify({
      outputChannels: [],
      allowedGuildsIds: [],
      mutedGuildsIds: [],
      allowedChannelsIds: [],
      mutedChannelsIds: [],
      allowedUsersIds: [],
      mutedUsersIds: [],
      channelConfigs: {},
      disableLinkPreview: false,
      imagesAsMedia: true,
      showDate: false,
      showChat: true,
      stackMessages: false,
      showMessageUpdates: false,
      showMessageDeletions: false
    });

    const formattedDefaultConfig = await prettier.format(defaultConfig, {
      parser: "json"
    });

    await writeFile("./config.json", formattedDefaultConfig);
  }

  const configString = await readFile("./config.json");
  const config: Config = JSON.parse(configString.toString());

  const idTypes = [
    config.outputChannels,
    config.mutedGuildsIds,
    config.allowedGuildsIds,
    config.mutedChannelsIds,
    config.allowedChannelsIds,
    config.allowedUsersIds,
    config.mutedUsersIds,
    ...Object.keys(config.channelConfigs ?? {}).flatMap((key) => [
      config.channelConfigs[key].allowed,
      config.channelConfigs[key].muted
    ])
  ];

  testIDsType(idTypes.filter((ids) => ids != undefined).flat());

  return config;
}

export function testIDsType(ids: ChannelId[]) {
  for (const id of ids) {
    if (typeof id != "string") {
      console.warn(
        `${id} is not a string! This could lead to errors when matching ids. Please input strings in "${id}" format (with quotes)`
      );
    }
  }
}

import { Message, PartialMessage } from "discord.js-selfbot-v13";

import { ChannelId, Config } from "./config.js";

export function isAllowedByConfig(
  message: Message<boolean> | PartialMessage,
  config: Config
): boolean {
  const allowedUsers = [
    ...(config.allowedUsersIds ?? []),
    ...(config.channelConfigs?.[message.channelId]?.allowed ?? [])
  ];

  const mutedUsers = [
    ...(config.mutedUsersIds ?? []),
    ...(config.channelConfigs?.[message.channelId]?.muted ?? [])
  ];

  const authorId =
    "author" in message && message.author ? message.author.id : undefined;

  return (
    // Guild check
    (typeof message.guildId !== "string" ||
      (isInAllowedIds(message.guildId, config.allowedGuildsIds) &&
        isNotInMutedIds(message.guildId, config.mutedGuildsIds))) &&
    // Channel check
    isInAllowedIds(message.channelId, config.allowedChannelsIds) &&
    isNotInMutedIds(message.channelId, config.mutedChannelsIds) &&
    // Author check
    (authorId === undefined ||
      (isInAllowedIds(authorId, allowedUsers) &&
        isNotInMutedIds(authorId, mutedUsers)))
  );
}

export function isNotInMutedIds(id: string, mutedIds: ChannelId[] = []) {
  return (
    mutedIds.length == 0 ||
    !(mutedIds.includes(id) || mutedIds.includes(Number(id)))
  );
}

export function isInAllowedIds(id: string, allowedIds: ChannelId[] = []) {
  return (
    allowedIds.length == 0 ||
    allowedIds.includes(id) ||
    allowedIds.includes(Number(id))
  );
}

import { autoRetry } from "@grammyjs/auto-retry";
import { Bot } from "grammy";
import { InputMediaPhoto } from "grammy/types";

import { ChannelId } from "./config.js";

export enum BotType {
  Telegram = "telegram",
  DiscordWebhook = "discord_webhook"
}

export class SenderBot {
  chatsToSend: ChannelId[];
  telegramTopicId?: number;
  disableLinkPreview: boolean = false;

  botType: BotType = BotType.Telegram;

  grammyClient?: Bot;

  constructor(options: {
    chatsToSend: ChannelId[];
    disableLinkPreview?: boolean;

    botType?: BotType;

    grammyClient?: Bot;
    telegramTopicId?: number;
  }) {
    this.chatsToSend = options.chatsToSend;
    this.disableLinkPreview = options.disableLinkPreview;
    this.telegramTopicId = options.telegramTopicId;

    this.botType = options.botType;

    switch (this.botType) {
      case BotType.Telegram:
        this.grammyClient = options.grammyClient;

        this.grammyClient.api.config.use(autoRetry());

        this.grammyClient.catch((err) => {
          console.error(err);
        });
    }
  }

  async prepare() {
    const me = await this.grammyClient.api.getMe();
    return console.log(`Logged into Telegram as @${me.username}`);
  }

  async sendData(messagesToSend: string[], imagesToSend: InputMediaPhoto[]) {
    if (messagesToSend.length == 0) return;

    for (const chatId of this.chatsToSend) {
      try {
        if (imagesToSend.length != 0)
          await this.grammyClient.api.sendMediaGroup(chatId, imagesToSend, {
            reply_parameters: {
              message_id: this.telegramTopicId
            }
          });
      } catch (err) {
        console.error(err);
      }

      if (messagesToSend.length == 0 || messagesToSend.join("") == "") return;

      const renderedMessage = messagesToSend.join("\n");

      const messageChunks: string[] = [];
      const MESSAGE_CHUNK = 4096;

      for (
        let i = 0, charsLength = renderedMessage.length;
        i < charsLength;
        i += MESSAGE_CHUNK
      ) {
        messageChunks.push(renderedMessage.substring(i, i + MESSAGE_CHUNK));
      }

      for (const messageChunk of messageChunks.reverse()) {
        await this.grammyClient.api.sendMessage(chatId, messageChunk, {
          link_preview_options: {
            is_disabled: this.disableLinkPreview
          },
          reply_parameters: {
            message_id: this.telegramTopicId
          }
        });
      }
    }
  }
}

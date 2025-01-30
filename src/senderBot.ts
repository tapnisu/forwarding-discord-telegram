import { autoRetry } from "@grammyjs/auto-retry";
import { Bot } from "grammy";
import { InputMediaPhoto } from "grammy/types";
import { Webhook } from "discord-webhook-node";

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
  webhookClient?: Webhook;

  constructor(options: {
    chatsToSend: ChannelId[];
    disableLinkPreview?: boolean;

    botType?: BotType;

    grammyClient?: Bot;
    telegramTopicId?: number;

    webhookClient?: Webhook;
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

        break;

      case BotType.DiscordWebhook:
        this.webhookClient = options.webhookClient;
        break;
    }
  }

  async prepare() {
    switch (this.botType) {
      case BotType.Telegram: {
        const me = await this.grammyClient.api.getMe();
        return console.log(`Logged into Telegram as @${me.username}`);
      }
    }
  }

  async sendData(messagesToSend: string[], imagesToSend: InputMediaPhoto[]) {
    if (messagesToSend.length == 0) return;

    for (const chatId of this.chatsToSend) {
      if (this.botType == BotType.Telegram)
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

      const text = messagesToSend.join("\n");

      switch (this.botType) {
        case BotType.Telegram: {
          const messageChunks: string[] = [];
          const MESSAGE_CHUNK = 4096;

          for (
            let i = 0, charsLength = text.length;
            i < charsLength;
            i += MESSAGE_CHUNK
          ) {
            messageChunks.push(text.substring(i, i + MESSAGE_CHUNK));
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
          break;
        }

        case BotType.DiscordWebhook: {
          this.webhookClient.send(text);
          break;
        }
      }
    }
  }
}

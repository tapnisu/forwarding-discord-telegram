import { autoRetry } from "@grammyjs/auto-retry";
import { Bot, BotConfig, Context } from "grammy";
import { InputMediaPhoto } from "grammy/types";

import { ChannelId } from "./config.js";

export class SenderBot<C extends Context = Context> extends Bot<C> {
  chatsToSend: ChannelId[];
  telegramTopicId?: number;
  disableLinkPreview: boolean;

  constructor(
    token: string,
    chatsToSend: ChannelId[],
    disableLinkPreview: boolean,
    config?: BotConfig<C>,
    telegramTopicId?: number
  ) {
    super(token, config);

    this.chatsToSend = chatsToSend;
    this.disableLinkPreview = disableLinkPreview;
    this.telegramTopicId = telegramTopicId;

    this.api.config.use(autoRetry());

    this.catch((err) => {
      console.error(err);
    });
  }

  async sendData(messagesToSend: string[], imagesToSend: InputMediaPhoto[]) {
    if (messagesToSend.length == 0) return;

    for (const chatId of this.chatsToSend) {
      try {
        if (imagesToSend.length != 0)
          await this.api.sendMediaGroup(chatId, imagesToSend, {
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
        await this.api.sendMessage(chatId, messageChunk, {
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

import { autoRetry } from "@grammyjs/auto-retry";
import { Bot, BotConfig, Context } from "grammy";
import { ChannelId } from "./config.js";
import { InputMediaPhoto } from "grammy/types";

export class SenderBot<C extends Context = Context> extends Bot<C> {
  chatsToSend: ChannelId[];
  disableLinkPreview: boolean;

  constructor(
    token: string,
    chatsToSend: ChannelId[],
    disableLinkPreview: boolean,
    config?: BotConfig<C>
  ) {
    super(token, config);

    this.chatsToSend = chatsToSend;
    this.disableLinkPreview = disableLinkPreview;

    this.api.config.use(autoRetry());

    this.catch((err) => {
      console.error(err);
    });
  }

  async sendData(messagesToSend: string[], imagesToSend: InputMediaPhoto[]) {
    if (messagesToSend.length != 0) {
      this.chatsToSend.forEach(async (chatId) => {
        try {
          if (imagesToSend.length != 0)
            await this.api.sendMediaGroup(chatId, imagesToSend);
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

        messageChunks.reverse().forEach(
          async (messageChunk) =>
            await this.api.sendMessage(chatId, messageChunk, {
              link_preview_options: {
                is_disabled: this.disableLinkPreview
              }
            })
        );
      });
    }
  }
}

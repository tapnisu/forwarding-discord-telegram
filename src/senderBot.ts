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
        if (imagesToSend.length != 0)
          await this.api.sendMediaGroup(chatId, imagesToSend);

        if (messagesToSend.length == 0 || messagesToSend.join("") == "") return;

        await this.api.sendMessage(chatId, messagesToSend.join("\n"), {
          link_preview_options: {
            is_disabled: this.disableLinkPreview
          }
        });
      });
    }
  }
}

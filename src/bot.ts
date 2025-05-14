import {
  AnyChannel,
  Client as SelfBotClient,
  Message,
  MessageAttachment,
  PartialMessage,
  Role,
  User
} from "discord.js-selfbot-v13";
import { Client as BotClient } from "discord.js";
import { InputMediaBuilder } from "grammy";
import { InputFile, InputMediaPhoto } from "grammy/types";

import { Config } from "./config.js";
import { isAllowedByConfig } from "./filterMessages.js";
import { escapeHtml, formatSize } from "./format.js";
import { SenderBot } from "./senderBot.js";

interface RenderOutput {
  content: string;
  images: InputMediaPhoto[];
}

export type Client<Ready extends boolean = boolean> =
  | SelfBotClient<Ready>
  | BotClient<Ready>;

export class Bot {
  messagesToSend: string[] = [];
  imagesToSend: InputMediaPhoto[] = [];
  senderBot: SenderBot;
  config: Config;
  client: Client;

  constructor(client: Client, config: Config, senderBot: SenderBot) {
    this.config = config;
    this.senderBot = senderBot;
    this.client = client;

    // @ts-expect-error This expression is not callable.
    this.client.on("ready", (clientArg: Client<true>) => {
      console.log(`Logged into Discord as @${clientArg.user?.tag}!`);
    });

    // @ts-expect-error This expression is not callable.
    this.client.on("messageCreate", async (message: Message) => {
      if (!isAllowedByConfig(message, this.config)) return;
      const renderOutput = await this.messageAction(message);

      if (this.config.stackMessages) {
        this.messagesToSend.push(renderOutput.content);
        this.imagesToSend.push(...renderOutput.images);
      } else {
        await this.senderBot.sendData(
          [renderOutput.content],
          renderOutput.images
        );
      }
    });

    if (config.showMessageUpdates)
      // @ts-expect-error This expression is not callable.
      this.client.on(
        "messageUpdate",
        async (_oldMessage: Message, newMessage: Message) => {
          if (!isAllowedByConfig(newMessage, this.config)) return;
          const renderOutput = await this.messageAction(newMessage, "updated");

          if (this.config.stackMessages) {
            this.messagesToSend.push(renderOutput.content);
            this.imagesToSend.push(...renderOutput.images);
          } else {
            await this.senderBot.sendData(
              [renderOutput.content],
              renderOutput.images
            );
          }
        }
      );

    if (config.showMessageDeletions)
      // @ts-expect-error This expression is not callable.
      this.client.on("messageDelete", async (message: Message) => {
        if (!isAllowedByConfig(message, this.config)) return;
        const renderOutput = await this.messageAction(message, "deleted");

        if (this.config.stackMessages) {
          this.messagesToSend.push(renderOutput.content);
          this.imagesToSend.push(...renderOutput.images);
        } else {
          this.senderBot.sendData([renderOutput.content], renderOutput.images);
        }
      });

    if (config.stackMessages)
      setInterval(() => {
        this.senderBot.sendData(this.messagesToSend, this.imagesToSend);
        this.messagesToSend = [];
        this.imagesToSend = [];
      }, 5000);
  }

  async messageAction(
    message: Message<boolean> | PartialMessage,
    tag?: string
  ) {
    const date = new Date().toLocaleString("en-US", {
      day: "2-digit",
      year: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    let render = "";
    const allAttachments: string[] = [];
    const images: InputMediaPhoto[] = [];

    if (tag) render += `[${tag}] `;
    if (this.config.showDate) render += `[${date}] `;
    if (this.config.showChat)
      render += message.inGuild()
        ? `[${message.guild?.name} / ${message.channel?.name} / ${message.author?.tag}]: `
        : `[${message.author?.tag}]: `;

    if (message.reference) {
      const referenceMessage = await message.fetchReference();
      const renderOutput = await this.messageAction(referenceMessage);
      render += `\n(Reference to @${referenceMessage.author.tag}'s msg:\n> ${renderOutput.content})\n`;
      images.push(...renderOutput.images);
    }

    render += await this.renderMentions(
      message.content,
      message.mentions.users.values(),
      message.mentions.channels.values(),
      message.mentions.roles.values()
    );

    render = escapeHtml(render);

    const embeds = message.embeds.map((embed) => {
      let stringEmbed = "";
      let otherEmbedParts = "";

      if (embed.title)
        stringEmbed += `<a href="${escapeHtml(embed.url)}">${escapeHtml(embed.title)}\n</a>`;
      if (embed.description) otherEmbedParts += `  ${embed.description}\n`;
      if (embed.color) otherEmbedParts += `  Color: ${embed.color}\n`;
      if (embed.timestamp) otherEmbedParts += `  Url: ${embed.timestamp}\n`;

      const fields = embed.fields.map(
        (field) => `    Name: ${field.name}\n      Value: ${field.value}\n`
      );
      if (fields.length != 0)
        otherEmbedParts += `  Fields:\n${fields.join("")}`;

      if (embed.thumbnail)
        otherEmbedParts += `  Thumbnail: ${embed.thumbnail.url}\n`;
      if (embed.image) {
        otherEmbedParts += `  Image: ${embed.image.url}\n`;

        if (this.config.imagesAsMedia)
          images.push(InputMediaBuilder.photo(embed.image.url));
      }
      if (embed.video) otherEmbedParts += `  Video: ${embed.video.url}\n`;
      if (embed.author) otherEmbedParts += `  Author: ${embed.author.name}\n`;
      if (embed.footer)
        otherEmbedParts += `  Footer: ${embed.footer.iconURL}\n`;

      stringEmbed += escapeHtml(otherEmbedParts);

      return `<blockquote>${stringEmbed}</blockquote>\n`;
    });

    render += embeds.join("");

    for (const attachment of message.attachments.values()) {
      if (
        this.config.imagesAsMedia &&
        attachment.contentType &&
        attachment.contentType.startsWith("image") &&
        attachment.size < 10 * 1024 * 1024
      ) {
        images.push(await this.attachmentToMedia(attachment));
        continue;
      }

      allAttachments.push(
        `Attachment:\n  Name: ${attachment.name}\n${
          attachment.description
            ? `	Description: ${attachment.description}\n`
            : ""
        }  Size: ${formatSize(attachment.size)}\n  Url: ${attachment.url}`
      );
    }

    render += allAttachments.map(escapeHtml).join("");

    console.log(render);

    return { content: render, images } as RenderOutput;
  }

  async attachmentToMedia(attachment: MessageAttachment) {
    if (attachment.size < 5 * 1024 * 1024)
      return InputMediaBuilder.photo(attachment.url);

    const res = await fetch(attachment.url);
    const data = await res.blob();
    const inputFile = new InputFile(data.stream());

    return InputMediaBuilder.photo(inputFile);
  }

  async renderMentions(
    text: string,
    users: IterableIterator<User>,
    channels: IterableIterator<AnyChannel>,
    roles: IterableIterator<Role>
  ) {
    for (const user of users) {
      text = text.replace(`<@${user.id}>`, `@${user.displayName}`);
    }

    for (const channel of channels) {
      try {
        const fetchedChannel = await channel.fetch();

        text = text.replace(
          `<#${channel.id}>`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `#${(fetchedChannel as any).name}`
        );
      } catch (err) {
        console.error(err);
      }
    }

    for (const role of roles) {
      text = text.replace(`<@&${role.id}>`, `@${role.name}`);
    }

    return text;
  }
}

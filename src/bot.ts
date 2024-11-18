import {
  AnyChannel,
  Client,
  Message,
  MessageAttachment,
  PartialMessage,
  Role,
  User
} from "discord.js-selfbot-v13";
import { Config } from "./config.js";
import { isAllowedByConfig } from "./filterMessages.js";
import { formatSize } from "./format.js";
import { SenderBot } from "./senderBot.js";
import { InputMediaBuilder } from "grammy";
import { InputFile, InputMediaPhoto } from "grammy/types";

export class Bot extends Client {
  messagesToSend: string[] = [];
  imagesToSend: InputMediaPhoto[] = [];
  senderBot: SenderBot;
  config: Config;

  constructor(config: Config, senderBot: SenderBot) {
    super();

    this.config = config;
    this.senderBot = senderBot;

    this.on("ready", () => {
      console.log(`Logged into Discord as @${this.user?.tag}!`);
    });

    this.on("messageCreate", (message) => {
      this.messageAction(message);
    });

    if (config.showMessageUpdates)
      this.on("messageUpdate", (_oldMessage, newMessage) => {
        this.messageAction(newMessage, "updated");
      });

    if (config.showMessageDeletions)
      this.on("messageDelete", (message) => {
        this.messageAction(message, "deleted");
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
    if (!isAllowedByConfig(message, this.config)) return;

    const date = new Date().toLocaleString("en-US", {
      day: "2-digit",
      year: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    let render = "";

    if (tag) render += `[${tag}] `;
    if (this.config.showDate) render += `[${date}] `;
    if (this.config.showChat)
      render += message.inGuild()
        ? `[${message.guild?.name} / ${message.channel?.name} / ${message.author?.tag}]: `
        : `[${message.author?.tag}]: `;

    if (message.reference) {
      const referenceMessage = await message.fetchReference();
      render += `\n(Reference to @${referenceMessage.author.tag}'s msg: ${referenceMessage.content})\n`;
    }

    render += await this.renderMentions(
      message.content,
      message.mentions.users.values(),
      message.mentions.channels.values(),
      message.mentions.roles.values()
    );

    const allAttachments: string[] = [];
    const images: InputMediaPhoto[] = [];

    const embeds = message.embeds.map((embed) => {
      let stringEmbed = "Embed:\n";

      if (embed.title) stringEmbed += `  Title: ${embed.title}\n`;
      if (embed.description)
        stringEmbed += `  Description: ${embed.description}\n`;
      if (embed.url) stringEmbed += `  Url: ${embed.url}\n`;
      if (embed.color) stringEmbed += `  Color: ${embed.color}\n`;
      if (embed.timestamp) stringEmbed += `  Url: ${embed.timestamp}\n`;

      const fields = embed.fields.map(
        (field) =>
          `    Field:\n      Name: ${field.name}\n      Value: ${field.value}\n`
      );
      if (fields.length != 0) stringEmbed += `  Fields:\n${fields.join("")}`;

      if (embed.thumbnail)
        stringEmbed += `  Thumbnail: ${embed.thumbnail.url}\n`;
      if (embed.image) {
        stringEmbed += `  Image: ${embed.image.url}\n`;

        if (this.config.imagesAsMedia)
          images.push(InputMediaBuilder.photo(embed.image.url));
      }
      if (embed.video) stringEmbed += `  Video: ${embed.video.url}\n`;
      if (embed.author) stringEmbed += `  Author: ${embed.author.name}\n`;
      if (embed.footer) stringEmbed += `  Footer: ${embed.footer.iconURL}\n`;

      return stringEmbed;
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

    render += allAttachments.join("");

    console.log(render);

    if (this.config.stackMessages) {
      this.messagesToSend.push(render);
      this.imagesToSend.push(...images);
      return;
    }

    this.senderBot.sendData([render], images);
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

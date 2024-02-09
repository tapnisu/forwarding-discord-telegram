import { Client } from "discord.js-selfbot-v13";
import { Config } from "./config.js";
import { filterMessages } from "./filterMessages.js";
import { formatSize } from "./format.js";
import { SenderBot } from "./senderBot.js";

export class Bot extends Client {
  messagesToSend: string[] = [];
  imagesToSend: string[] = [];
  senderBot: SenderBot;
  config: Config;

  constructor(config: Config, senderBot: SenderBot) {
    super();

    this.config = config;
    this.senderBot = senderBot;

    this.on("ready", () => console.log(`Logged in as ${this.user?.tag}!`));

    this.on("messageCreate", (message) => {
      if (!filterMessages(message, this.config)) return;

      const date = new Date().toLocaleString("en-US", {
        day: "2-digit",
        year: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      let render = "";

      if (config.showDate) render += `[${date}] `;
      if (config.showChat)
        render += message.inGuild()
          ? `[${message.guild.name} / ${message.channel.name} / ${message.author.tag}]: `
          : `[${message.author.tag}]: `;

      render += message.content;

      const allAttachments: string[] = [];
      const images: string[] = [];

      const embeds = message.embeds.map((embed) => {
        let stringEmbed = "Embed:\n";

        if (embed.title) stringEmbed += `  Title: ${embed.title}\n`;
        if (embed.description)
          stringEmbed += `  Description: ${embed.description}\n`;
        if (embed.url) stringEmbed += `  Url: ${embed.url}\n`;
        if (embed.color) stringEmbed += `  Color: ${embed.color}\n`;
        if (embed.timestamp) stringEmbed += `  Url: ${embed.timestamp}\n`;

        const allFields = ["  Fields:\n"];

        embed.fields.forEach((field) => {
          let stringField = "    Field:\n";

          if (field.name) stringField += `      Name: ${field.name}\n`;
          if (field.value) stringField += `      Value: ${field.value}\n`;

          allFields.push(stringField);
        });

        if (allFields.length != 1) stringEmbed += `${allFields.join("")}`;
        if (embed.thumbnail)
          stringEmbed += `  Thumbnail: ${embed.thumbnail.url}\n`;
        if (embed.image) {
          stringEmbed += `  Image: ${embed.image.url}\n`;

          if (config.imagesAsMedia ?? true) images.push(embed.image.url);
        }
        if (embed.video) stringEmbed += `  Video: ${embed.video.url}\n`;
        if (embed.author) stringEmbed += `  Author: ${embed.author.name}\n`;
        if (embed.footer) stringEmbed += `  Footer: ${embed.footer.iconURL}\n`;

        return stringEmbed;
      });

      if (embeds.length != 0) render += embeds.join("");

      message.attachments.forEach((attachment) => {
        if (
          (config.imagesAsMedia ?? true) &&
          attachment.contentType.startsWith("image")
        )
          return images.push(attachment.url);

        allAttachments.push(
          `Attachment:\n  Name: ${attachment.name}\n${
            attachment.description
              ? `	Description: ${attachment.description}\n`
              : ""
          }  Size: ${formatSize(attachment.size)}\n  Url: ${attachment.url}`
        );
      });

      if (allAttachments.length != 0) render += allAttachments.join("");

      console.log(render);

      if (config.stackMessages) {
        this.messagesToSend.push(render);
        this.imagesToSend.push(...images);

        return;
      }

      this.senderBot.sendData([render], images);
    });

    if (config.stackMessages)
      setInterval(() => {
        this.senderBot.sendData(this.messagesToSend, this.imagesToSend);

        this.messagesToSend.length = 0;
        this.imagesToSend.length = 0;
      }, 5000);
  }
}

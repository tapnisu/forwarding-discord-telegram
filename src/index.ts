import { Client } from "discord.js-selfbot-v13";
import { getConfig } from "./config";
import { getEnv } from "./env";

const env = getEnv();
const config = getConfig();

let channelsToSend = config.outputChannels ?? [];
if (env.TELEGRAM_CHAT_ID)
	channelsToSend = [env.TELEGRAM_CHAT_ID, ...channelsToSend];

const client = new Client({
	checkUpdate: false
});

const messagesToSend: string[] = [];

client.on("ready", () => console.log(`Logged in as ${client.user?.tag}!`));

const SIZE_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

function formatSize(length: number) {
	let i = 0;

	while ((length / 1000) | 0 && i < SIZE_UNITS.length - 1) {
		length /= 1024;

		i++;
	}

	return `${length.toFixed(2)} ${SIZE_UNITS[i]}`;
}

client.on("messageCreate", (message) => {
	// TODO: Please rewrite this mess
	if (
		config.mutedGuildsIds != undefined &&
		config.mutedGuildsIds?.length != 0 &&
		(config.mutedGuildsIds?.includes(message.guildId) ||
			config.mutedGuildsIds?.includes(Number(message.guildId)))
	)
		return;

	if (
		config.allowedGuildsIds != undefined &&
		config.allowedGuildsIds?.length != 0 &&
		!config.allowedGuildsIds?.includes(message.guildId) &&
		!config.allowedGuildsIds?.includes(Number(message.guildId))
	)
		return;

	if (
		config.mutedChannelsIds != undefined &&
		config.mutedChannelsIds?.length != 0 &&
		(config.mutedChannelsIds?.includes(message.channel.id) ||
			config.mutedChannelsIds?.includes(Number(message.channel.id)))
	)
		return;

	if (
		config.allowedChannelsIds != undefined &&
		config.allowedChannelsIds?.length != 0 &&
		!config.allowedChannelsIds?.includes(message.channel.id) &&
		!config.allowedChannelsIds?.includes(Number(message.channel.id))
	)
		return;

	if (
		config.mutedUsersIds != undefined &&
		config.mutedUsersIds?.length != 0 &&
		(config.mutedUsersIds?.includes(message.author.id) ||
			config.mutedUsersIds?.includes(Number(message.author.id)))
	)
		return;

	if (
		config.allowedUsersIds != undefined &&
		config.allowedUsersIds?.length != 0 &&
		!config.allowedUsersIds?.includes(message.author.id) &&
		!config.allowedUsersIds?.includes(Number(message.author.id))
	)
		return;

	if (
		config.channelConfigs != undefined &&
		config.channelConfigs?.[message.channel.id] != undefined &&
		config.channelConfigs?.[message.channel.id]?.allowed != undefined &&
		config.channelConfigs?.[message.channel.id]?.allowed?.length != 0 &&
		!config.channelConfigs?.[message.channel.id]?.allowed?.includes(
			message.author.id
		) &&
		!config.channelConfigs?.[message.channel.id]?.allowed?.includes(
			Number(message.author.id)
		)
	)
		return;

	if (
		config.channelConfigs?.[message.channel.id] != undefined &&
		config.channelConfigs?.[message.channel.id]?.muted != undefined &&
		config.channelConfigs?.[message.channel.id]?.muted?.length != 0 &&
		(config.channelConfigs?.[message.channel.id]?.muted?.includes(
			message.author.id
		) ||
			config.channelConfigs?.[message.channel.id]?.muted?.includes(
				Number(message.author.id)
			))
	)
		return;

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
		if (embed.thumbnail) stringEmbed += `  Thumbnail: ${embed.thumbnail.url}\n`;
		if (embed.image) stringEmbed += `  Image: ${embed.image.url}\n`;
		if (embed.video) stringEmbed += `  Video: ${embed.video.url}\n`;
		if (embed.author) stringEmbed += `  Author: ${embed.author.name}\n`;
		if (embed.footer) stringEmbed += `  Footer: ${embed.footer.iconURL}\n`;

		return stringEmbed;
	});

	if (embeds.length != 0) render += embeds.join("");

	const allAttachments: string[] = [];

	message.attachments.forEach((attachment) => {
		allAttachments.push(
			`Attachment:\n  Name: ${attachment.name}\n${
				attachment.description ? `	Description: ${attachment.description}\n` : ""
			}  Size: ${formatSize(attachment.size)}\n  Url: ${attachment.url}`
		);
	});

	if (allAttachments.length != 0) render += allAttachments.join("");

	console.log(render);

	if (config.stackMessages) {
		messagesToSend.push(render);

		return;
	}

	sendData([render]);
});

async function sendData(messagesToSend: string[]) {
	try {
		if (messagesToSend.length != 0) {
			channelsToSend.forEach(async (channelId) => {
				const channel = await client.channels.fetch(channelId.toString());

				if (channel.isDirectory()) return;

				channel.send({
					content: messagesToSend.join("\n")
				});
			});
		}
	} catch (e) {
		console.error(e);
	}
}

if (config.stackMessages)
	setInterval(() => {
		sendData(messagesToSend);

		messagesToSend.length = 0;
	}, 5000);

client.login(env.DISCORD_TOKEN);

const { Telegraf } = require('telegraf')
const Discord = require('discord.js-selfbot')
const dotenv = require('dotenv')

;(async () => {
	if (process.env.NODE_ENV != 'production') {
		await dotenv.config()
	}
})()

const client = new Discord.Client()
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (message) => {
	const date = new Date().toLocaleString('en-US', {
		day: '2-digit',
		year: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})

	let toSend = `[${date}] [${message.guild.name} / ${message.channel.name} / ${message.author.tag}]: ${message.content}`

	let allEmbeds = []

	message.embeds.forEach((embed) => {
		let stringEmbed = 'Embed:\n'

		if (embed.title) stringEmbed += `  Title: ${embed.title}\n`
		if (embed.description)
			stringEmbed += `  Description: ${embed.description}\n`
		if (embed.url) stringEmbed += `  Url: ${embed.url}\n`
		if (embed.color) stringEmbed += `  Color: ${embed.color}\n`
		if (embed.timestamp) stringEmbed += `  Url: ${embed.timestamp}\n`

		let allFields = ['  Fields:\n']

		embed.fields.forEach((field) => {
			let stringField = '    Field:\n'

			if (field.name) stringField += `      Name: ${field.name}\n`
			if (field.value) stringField += `      Value: ${field.value}\n`

			allFields = [...allFields, stringField]
		})

		if (allFields.length != 1) stringEmbed += `${allFields.join('')}`
		if (embed.thumbnail) stringEmbed += `  Thumbnail: ${embed.thumbnail.url}\n`
		if (embed.image) stringEmbed += `  Image: ${embed.image.url}\n`
		if (embed.video) stringEmbed += `  Video: ${embed.video.url}\n`
		if (embed.author) stringEmbed += `  Author: ${embed.author.name}\n`
		if (embed.footer) stringEmbed += `  Footer: ${embed.footer.iconURL}\n`

		allEmbeds = [...allEmbeds, stringEmbed]
	})

	if (allEmbeds.length != 0) toSend += allEmbeds.join('')

	console.log(toSend)

	try {
		bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, toSend)
	} catch (error) {
		console.log('Error, to to much messages!')
	}
})

client.login(process.env.DISCORD_TOKEN)

# Forwarding discord to telegram bot

This bot can help you to read discord messages in telegram.

> **Warning**:
> Selfbots are against Discord's Terms of Service, use at your own risk!

## Setup



1. Install node.js from <https://nodejs.org/en/> (version >= 12)

1. Clone this project via

   `git clone https://github.com/taprisu/forwarding-discord-telegram.git`

1. Create `.env` file

   ```env
   DISCORD_TOKEN=<YOUR_DISCORD_TOKEN>
   TELEGRAM_TOKEN=<YOUR_TELEGRAM_TOKEN>
   TELEGRAM_CHAT_ID=<YOUR_TELEGRAM_CHAT_ID>
   ```

1. Config your bot via [`config.json`](сonfig.json) (insert your values)

   ```json
   {
	   "mutedChannelsIds": [1013671171029467227],
	   "allowedChannelsIds": [],
	   "allowedUsersIds": [],
	   "mutedUsersIds": [1038694628490235904],
	   "channelConfigs": {
		   "1013671171029467227": {
			   "muted": [869088074758520832],
			   "allowed": []
		   }
	   },
	   "showDate": true,
	   "showChat": true,
	   "stackMessages": false
   }
   ```

1. Install dependencies via

   `npm i` / `yarn` / `pnpm i`

1. Run bot via

   `npm run start` / `yarn start` / `pnpm run start`

### 🎉 Now you have your bot running 🎉

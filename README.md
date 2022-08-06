# Forwarding discord to telegram bot

This bot can help you to read discord messages in telegam.

## Setup

### Disclaimer

Self-Bots are against Discord's Terms of Service, so your account can be banned.

1. Install node.js from <https://nodejs.org/en/> (version >= 12)

1. Clone this project via

   `git clone https://github.com/taprisu/forwarding-discord-telegram.git`

1. Create `.env` file

   ```env
   DISCORD_TOKEN=<YOUR_DISCORD_TOKEN>
   TELEGRAM_TOKEN=<YOUR_TELEGAM_TOKEN>
   TELEGRAM_CHAT_ID=<YOUR_TELEGRAM_CHAT_ID>
   ```

1. Config your bot via [`config.json`](сonfig.json)

   ```json
   {
   	"mutedChannelsIds": ["Muted channel id", "Muted channel id"],
   	"allowedChannelsIds": ["Allowed channels id", "Allowed channels id"]
   }
   ```

1. Install dependencies via

   `npm i` / `yarn` / `pnpm i`

1. Run bot via

   `npm run start` / `yarn start` / `pnpm run start`

### 🎉 Now you have your bot running 🎉

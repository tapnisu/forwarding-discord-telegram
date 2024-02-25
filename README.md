# Forwarding Discord to Telegram

Selfbot that forwards your Discord messages to Telegram

> **Warning**:
> Selfbots are against Discord's Terms of Service, use at your own risk!

## Setup

1. Install node.js from <https://nodejs.org/en/>

   > **Important**:
   > You should use version 16 or newer!

   If your system doesn't have Node 16 (or newer), you can use [Node Version Manager](https://github.com/nvm-sh/nvm).

2. Clone this project via `git clone https://github.com/tapnisu/forwarding-discord-telegram.git`

3. Create `.env` file

   ```env
   DISCORD_TOKEN=<YOUR_DISCORD_TOKEN>
   TELEGRAM_TOKEN=<YOUR_TELEGRAM_TOKEN>
   TELEGRAM_CHAT_ID=<YOUR_TELEGRAM_CHAT_ID>
   ```

4. Config your bot via [`config.json`](сonfig.json) (insert your values)

   ```json
   {
     "outputChannels": [],
     "mutedGuildsIds": [],
     "allowedGuildsIds": [],
     "mutedChannelsIds": [],
     "allowedChannelsIds": [],
     "allowedUsersIds": [],
     "mutedUsersIds": [],
     "channelConfigs": {},
     "disableLinkPreview": false,
     "imagesAsMedia": false,
     "showDate": true,
     "showChat": true,
     "stackMessages": false
   }
   ```

5. Install dependencies via

   `npm i` / `yarn` / `pnpm i`

6. Build bot via

   `npm build` / `yarn build` / `pnpm build`

7. Run bot via

   `npm start` / `yarn start` / `pnpm start`

### 🎉 Now you got your bot running 🎉

Built using [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13), [Grammy](https://www.npmjs.com/package/grammy) and TypeScript

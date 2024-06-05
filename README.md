# Forwarding Discord to Telegram

Selfbot that forwards your Discord messages to Telegram

> **Warning**:
> Selfbots are against Discord's Terms of Service, use at your own risk!

## Setup

1. Install node.js from <https://nodejs.org/en/>

   > **Important**:
   > You should use version 18 or newer!

   If your system doesn't have Node 18 (or newer), you can use [Node Version Manager](https://github.com/nvm-sh/nvm).

2. Clone this project:

   ```sh
   git clone https://github.com/tapnisu/forwarding-discord-telegram.git
   cd forwarding-discord-telegram
   ```

3. Install [pnpm](https://pnpm.io/) using [Corepack](https://nodejs.org/api/corepack.html):

   ```sh
   corepack enable
   corepack install
   ```

4. Create `.env` file

   ```env
   DISCORD_TOKEN=<YOUR_DISCORD_TOKEN>
   TELEGRAM_TOKEN=<YOUR_TELEGRAM_TOKEN>
   TELEGRAM_CHAT_ID=<YOUR_TELEGRAM_CHAT_ID>
   ```

5. Config your bot via [`config.json`](сonfig.json) (insert your values)

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
     "imagesAsMedia": true,
     "showDate": false,
     "showChat": true,
     "stackMessages": false,
     "showMessageUpdates": false,
     "showMessageDeletions": false
   }
   ```

6. Install dependencies:

   ```sh
   pnpm install
   ```

6. Build bot via

   ```sh
   pnpm build
   ```

7. Run bot via

   ```sh
   pnpm start
   ```

### 🎉 Now you got your bot running 🎉

Built using [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13), [Grammy](https://www.npmjs.com/package/grammy) and TypeScript

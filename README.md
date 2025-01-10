# Forwarding Discord to Telegram

Selfbot that forwards your Discord messages to Telegram

> **Warning**:
> Selfbots are against Discord's Terms of Service, use at your own risk!

## Setup

## Natively

1. Install node.js from <https://nodejs.org/en/>

   > **Important**:
   > You should use version 18 or newer!

   If your system doesn't have Node 18 (or newer), you can use [Node Version Manager](https://github.com/nvm-sh/nvm).

2. Clone this project:

   ```shell
   git clone https://github.com/tapnisu/forwarding-discord-telegram.git
   cd forwarding-discord-telegram
   ```

3. Install [pnpm](https://pnpm.io/) using [Corepack](https://nodejs.org/api/corepack.html):

   ```shell
   corepack enable
   corepack install
   ```

4. Create `.env` file

   ```env
   DISCORD_TOKEN=<YOUR_DISCORD_TOKEN>
   TELEGRAM_TOKEN=<YOUR_TELEGAM_TOKEN>
   TELEGRAM_CHAT_ID=<YOUR_TELEGRAM_CHAT_ID>

   # Optional
   # TELEGRAM_TOPIC_ID=<YOUR_TELEGRAM_TOKEN_ID>
   ```

5. Config your bot via [`config.json`](сonfig.json) (insert your values)

   ```json
   {
     "outputChannels": [],
     "allowedGuildsIds": [],
     "mutedGuildsIds": [],
     "allowedChannelsIds": [],
     "mutedChannelsIds": [],
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

   ```shell
   pnpm install
   ```

7. Build bot via

   ```shell
   pnpm build
   ```

8. Run bot via

   ```shell
   pnpm start
   ```

### Docker

1. [Install Docker Engine](https://docs.docker.com/engine/install/)

2. Config your bot via [`config.json`](сonfig.json) (insert your values)

   ```json
   {
     "outputChannels": [],
     "allowedGuildsIds": [],
     "mutedGuildsIds": [],
     "allowedChannelsIds": [],
     "mutedChannelsIds": [],
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

3. Run forwarding-discord-telegram using Docker

   ```shell
   docker run -d \
     --name forwarding-discord-telegram \
     --env DISCORD_TOKEN=${DISCORD_TOKEN} \
     --env TELEGRAM_TOKEN=${TELEGRAM_TOKEN} \
     --env TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID} \
     -v $(pwd)/config.json:/app/config.json \
     --restart unless-stopped \
     tapnisu/forwarding-discord-telegram
   ```

### Docker Compose

1. [Install Docker Engine](https://docs.docker.com/engine/install/)

2. Config your bot via [`config.json`](сonfig.json) (insert your values)

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

3. Run forwarding-discord-telegram using Docker Compose

   ```shell
   docker compose up -d
   ```

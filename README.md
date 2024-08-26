# Kick Channel Tracker Bot

![Kick Channel Tracker Bot](/images/notify.png)
![Kick bot Help](/images/help.png)

## Overview

Kick Channel Tracker Bot is a Discord bot designed to track Kick streaming channels. This bot allows users to easily add or remove Kick channels from a tracking list, providing a seamless experience to manage stream monitoring on your Discord server.

## Features

- **Add Kick Channel:** Easily add a Kick channel to the tracking list with the `/add-kick` command.
- **Remove Kick Channel:** Remove a Kick channel from the tracking list using the `/remove-kick` command.
- **Help Command:** Get a list of available commands with `/help`.

## Commands

- **/add-kick**: Add a Kick channel to the track list.
- **/remove-kick**: Remove the Kick channel from the track list.
- **/help**: Display a list of available commands.

## Installation

To set up the Kick Channel Tracker Bot, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/AstraDev0/kick_notify_discord.git
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your bot token:

   ```env
   DISCORD_TOKEN=your_bot_token
   CLIENT_ID=your_bot_id
   UPDATE_INTERVAL=interval_checking_ms
   ```

4. Start the bot:

   ```bash
   npm run start
   ```

## Usage

1. Invite the bot to your Discord server.
2. Use the `/add-kick` command to start tracking a Kick channel.
3. Use the `/remove-kick` command to stop tracking a Kick channel.
4. Type `/help` to see the list of available commands.

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Credits

- Developed by [AstraDev0](https://github.com/AstraDev0).
- Inspired by the growing need to manage Kick streams directly from Discord.

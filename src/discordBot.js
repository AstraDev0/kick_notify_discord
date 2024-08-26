require('dotenv').config();
const { Client, Events, GatewayIntentBits, TextChannel, REST, Routes, Collection } = require('discord.js');
const LiveStream = require('./liveStream');
const DatabaseHdl = require('./database');
const { buildMessage } = require('../utils/utils');
const { exit } = require('process');
const addKickCommand = require('./commands/addKick');
const removeKickCommand = require('./commands/removeKick');
const helpCommand = require('./commands/help');

class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
    this.client.commands = new Collection();
    this.client.commands.set(addKickCommand.data.name, addKickCommand);
    this.client.commands.set(removeKickCommand.data.name, removeKickCommand);
    this.client.commands.set(helpCommand.data.name, helpCommand);
    this.livestream = new LiveStream();
    this.database = new DatabaseHdl();
    this.updateInterval = process.env.UPDATE_INTERVAL;
    this.client.once(Events.ClientReady, () => this.onReady());
    process.on('SIGINT', () => this.shutdown());
  }
  async onReady() {
    console.log(
      `Logged in as ${this.client.user.tag}`
    );
    this.commandHandle();
    this.listenMessages();
    this.monitorLivestreamStatus();
  }

  shutdown() {
    this.database.closeDatabase();
    exit()
  }

  async monitorLivestreamStatus() {
    this.loopAllUserLivesteam();
    setInterval(() => this.loopAllUserLivesteam(), this.updateInterval);
  }

  async loopAllUserLivesteam() {
    const usersDataDb = await this.database.getusers();
    for (let userDataDb of usersDataDb) {
      this.checkLivestreamStatus(userDataDb)
    }
  }

  async checkLivestreamStatus(userDataDb) {
    const liveStreamData = await this.livestream.getLiveStatus(userDataDb.channelName);
    if (!(liveStreamData && new Date(liveStreamData.started_at) > new Date(userDataDb.lastTimeUpdateLive))) return;
    this.database.editChannelLastTime(userDataDb.userId, userDataDb.channelName, new Date().toISOString())
    this.sendDiscordMessage(liveStreamData, userDataDb)
  }

  async commandHandle() {
    const commands = [
      helpCommand.data.toJSON(),
      addKickCommand.data.toJSON(),
      removeKickCommand.data.toJSON()
    ];
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
      });
    } catch (error) {
      console.error('Error registering commands:', error);
    }
  }

  listenMessages() {
    this.client.on('interactionCreate', async interaction => {
      if (interaction.isCommand()) {
        try {
          if (interaction.guild) {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (member && !member.permissions.has('ADMINISTRATOR')) {
              return interaction.user.send('You do not have permission to use this bot.')
                .catch(() => interaction.reply({ content: 'Could not send you a DM. Make sure your DMs are open.', ephemeral: true }));
            }
          }
          const command = this.client.commands.get(interaction.commandName);
          if (!command) return;
          await command.execute(interaction, this.database);
        } catch (error) {
          console.error('Error executing command:', error);
          interaction.user.send('There was an error while executing this command!')
            .catch(() => interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }));
        }
      }
    });
  }

  async sendDiscordMessage(liveStreamData, dbData) {
    try {
      const channel = await this.client.channels.fetch(dbData.pingChannel);
      const embed = buildMessage(liveStreamData, dbData.role);
      if (channel instanceof TextChannel) {
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error sending Discord message:', error);
    }
  }

  start() {
    this.client.login(process.env.DISCORD_TOKEN);
  }
}

module.exports = DiscordBot;
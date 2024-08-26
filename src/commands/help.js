const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display a list of available commands'),
    async execute(interaction) {
        const commands = [
            {
                name: 'add-kick',
                description: 'Add a Kick channel to track list'
            },
            {
                name: 'remove-kick',
                description: 'Remove the Kick channel from track list'
            }
        ];

        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setDescription('Here are the commands you can use with this bot:')
            .setFooter({ text: 'Bot' })
            .addFields(commands.map(command => ({ name: `/${command.name}`, value: command.description, inline: false })));

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
};

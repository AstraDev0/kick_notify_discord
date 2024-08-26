const { SlashCommandBuilder } = require('@discordjs/builders');
const { extractChannelNameFromLink, checkKickChannel } = require('../../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-kick')
        .setDescription('Add a Kick link')
        .addStringOption(option =>
            option.setName('channel-link')
                .setDescription('Enter the Kick channel link')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel where notifications will be sent')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Select the role to mention')
                .setRequired(false)),
    async execute(interaction, database) {
        const channelLink = interaction.options.getString('channel-link');
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        const channelName = extractChannelNameFromLink(channelLink);

        if (!await checkKickChannel(channelLink)) {
            return await interaction.reply({ content: `The Kick link ${channelLink} is invalid.`, ephemeral: true });
        }
        const exists = await database.checkExistChannel(interaction.guildId, channelName);
        if (exists) {
            return await interaction.reply({ content: "Channel already exists.", ephemeral: true });
        }
        try {
            await database.addChannel(interaction.guildId, channelName, channel.id, role?.id);
            await interaction.reply({ content: `The Kick link ${channelLink} has been added with notifications in ${channel}.`, ephemeral: true });
        } catch (error) {
            console.error('Error adding Kick link:', error);
            await interaction.reply({ content: 'An error occurred while adding the Kick link. Please try again later.', ephemeral: true });
        }
    }
};

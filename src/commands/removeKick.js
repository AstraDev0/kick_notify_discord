const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkKickChannel, extractChannelNameFromLink } = require('../../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-kick')
        .setDescription('Remove a Kick link')
        .addStringOption(option =>
            option.setName('channel-link')
                .setDescription('Enter the Kick channel link to remove')
                .setRequired(true)),
    async execute(interaction, database) {
        const channelLink = interaction.options.getString('channel-link');
        const channelName = extractChannelNameFromLink(channelLink);
        try {
            if (!await checkKickChannel(channelLink)) {
                return await interaction.reply({ content: `The Kick link ${channelLink} is invalid.`, ephemeral: true });
            }
            const exists = await database.checkExistChannel(interaction.guildId, channelName);
            if (!exists) {
                return await interaction.reply({ content: "Channel does not exist.", ephemeral: true });
            }
            await database.removeChannel(interaction.guildId, channelName);
            await interaction.reply({ content: `The Kick link ${channelLink} has been removed.`, ephemeral: true });
        } catch (error) {
            console.error('Error executing remove-kick command:', error);
            await interaction.reply({ content: 'An error occurred while trying to remove the Kick link. Please try again later.', ephemeral: true });
        }
    }
};

const { default: initCycleTLS } = require('cycletls');
const { EmbedBuilder } = require('discord.js');

function getUri(user) {
   return `https://kick.com/api/v2/channels/${user}`;
}

function getStreamLink(user) {
   return `https://kick.com/${user}`;
}

function buildMessage(data, roleId) {
   const embed = new EmbedBuilder()
      .setColor('#53FC18')
      .setTitle(data.title)
      .setDescription(data.streamLink)
      .addFields(
         { name: 'Category', value: data.category, inline: true },
         { name: 'Viewers', value: `${data.viewers}`, inline: true },
         { name: 'Started At', value: data.started_at, inline: true },
      );
   if (roleId) {
      embed.addFields({ name: 'Mention', value: `<@&${roleId}>`, inline: true });
   }
   embed.setImage(data.thumbnail);
   return embed;
}

async function checkKickChannel(link) {
   try {
      const url = new URL(link);
      const cycleTLS = await initCycleTLS();
      const response = await cycleTLS(link);
      cycleTLS.exit();
      return response.status === 200 && url.hostname === 'kick.com' && /^\/[\w-]+$/.test(url.pathname);
   } catch (error) {
      return false;
   }
}

function extractChannelNameFromLink(link) {
   const match = link.match(/https:\/\/kick\.com\/([^\/]+)/);
   return match ? match[1] : null;
}

module.exports = {
   getUri,
   getStreamLink,
   buildMessage,
   checkKickChannel,
   extractChannelNameFromLink
};

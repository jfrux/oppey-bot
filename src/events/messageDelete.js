const { DMChannel } = require("discord.js");
module.exports = async (client, message) => {
  const DiscordMessage = client.orm.Model('DiscordMessage');
  const excludeChannels = require("../constants/exclude_channels.js");
  const excludeUsers = require("../constants/exclude_users.js");
  const isDM = message.channel instanceof DMChannel;
  if (isDM || excludeUsers.includes(parseInt(message.author.id)) || excludeChannels.includes(parseInt(message.channel.id))) {
    return;
  }
  try {
    let discordMessageModel = DiscordMessage.find(message.id);

    if (discordMessageModel) {
    discordMessageModel.destroy();
    }
  } catch (e) {
    console.error("Failed to archive message...");
  }
};

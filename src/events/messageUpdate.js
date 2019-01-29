const { DMChannel } = require("discord.js");
module.exports = async (client, oldMessage, newMessage) => {
  const DiscordMessage = client.orm.Model('DiscordMessage');
  const excludeChannels = require("../constants/exclude_channels.js");
  const excludeUsers = require("../constants/exclude_users.js");
  const isDM = newMessage.channel instanceof DMChannel;
  if (isDM || excludeUsers.includes(parseInt(newMessage.author.id)) || excludeChannels.includes(parseInt(newMessage.channel.id))) {
    return;
  }
  try {
    let discordMessageModel = DiscordMessage.find(newMessage.id);
    if (discordMessageModel) {
      discordMessageModel.update({
        content: newMessage.content,
        discord_user_id: newMessage.author.id,
        discord_channel_id: newMessage.channel.id,
        attachment_ids: {
          ...newMessage.attachments.array()
        }
      });
    }
  } catch (e) {
    console.error("Failed to update message...",e);
  }
};

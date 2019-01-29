const { DMChannel } = require("discord.js");
module.exports = async (client,message) => {
  const DiscordUser = client.orm.Model('DiscordUser');
  const DiscordMessage = client.orm.Model('DiscordMessage');
  const excludeChannels = require("../constants/exclude_channels.js");
  const excludeUsers = require("../constants/exclude_users.js");
  const isDM = message.channel instanceof DMChannel;
  if (isDM || excludeUsers.includes(parseInt(message.author.id)) || excludeChannels.includes(parseInt(message.channel.id))) {
    return;
  }
  try {
    let discordMessageModel = DiscordMessage.create({
      id: message.id,
      content: message.content,
      discord_user_id: message.author.id,
      discord_channel_id: message.channel.id,
      attachment_ids: {
        ...message.attachments.array()
      }
    });
  } catch (e) {
    console.error("Failed to archive message...",e);
  }
  
  try {
    let discordUserModel = DiscordUser.find(message.author.id);
    if (discordUserModel) {
      discordUserModel.update({
        last_seen_at: new Date(),
        last_seen_in: message.channel.id
      });
    }
  } catch (e) {
    console.error("Failed to update last seen...",e);
  }
};

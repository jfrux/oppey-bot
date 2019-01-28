module.exports = async (client,message) => {
  const DiscordUser = client.orm.Model('DiscordUser');
  let discordUserModel = await DiscordUser.find(message.author.id);
  if (discordUserModel) {
    discordUserModel.update({
      total_messages: discordUserModel.total_messages+1,
      last_seen_at: new Date(),
      last_seen_in: message.channel.id
    })
  }
};

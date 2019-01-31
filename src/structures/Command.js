const { Command } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client, info) {
		super(client, info);
    console.log("Registering command...", info.name);
  }
  async fetchDbUser(discordUser) {
    const User = this.client.orm.Model('DiscordUser');
    const user = await User.find(discordUser.id);
    console.log("Found user:",user);
    if (!user) {
      console.log("USER NOT FOUND, CREATING IT!");
      user = await User.create({
        id: discordUser.id,
        avatar: discordUser.displayAvatarURL(),
        username: discordUser.username
      });
    }
    return user;
  }
};
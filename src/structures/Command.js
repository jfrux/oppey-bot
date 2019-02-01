const { Command } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client, info) {
		super(client, {
      ...info,
      argsPromptLimit: info.argsPromptLimit || 0
    });
    console.log("Registering command...", info.name);
  }

  async reactSentDM(message) {
    const emoji = await message.guild.emojis.find(emoji => emoji.name === 'command_success_check_your_dm');

    await message.react(emoji);
  }
  async reactSentErrorDM(message) {
    const emoji = await message.guild.emojis.find(emoji => emoji.name === 'command_error_check_your_dm');

    await message.react(emoji);
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
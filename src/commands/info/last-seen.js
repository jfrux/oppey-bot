const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require("moment");
const excludeChannels = require("../../constants/exclude_channels.js");
module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'last-seen',
      group: 'info',
      aliases: ['lastseen'],
      hidden: true,
			memberName: 'last-seen',
			description: 'Responds with a user\'s last-seen date.',
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to get the know about?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
    let color, lastSeen, description, lastSeenIn, lastSeenAt, lastSeenInChannel;
    const DiscordUser = this.client.orm.Model('DiscordUser');
    // const User = client.orm.Model("User");
    let discordUserModel = await DiscordUser.find(user.id);
    if (discordUserModel) {
      lastSeenIn = discordUserModel.last_seen_in;
      lastSeenInChannel = msg.guild.channels.get(lastSeenIn);
      lastSeenAt = discordUserModel.last_seen_at;
      if (lastSeenAt) {
        const lastSeenDate = moment(lastSeenAt);
        lastSeen = lastSeenDate.fromNow();
        color = "#000000";
        description = `${user} was last seen ${lastSeen}`;
        if (!excludeChannels.includes(lastSeenIn)) {
          description = `${description} in ${lastSeenInChannel}.`
        } else {
          description = `${description}.`;
        }
        // const lastSeenInPermissionsForAuthor = msg.author.permissionsIn(lastSeenIn);
        
      } else {
        color = "#FF0000";
        description = `${user} has not been seen yet.`;
      }
    }
		// const embed = new MessageEmbed()
    //   .setTitle(`Last time I saw ${user.username}...`)
    //   .setDescription(description)
		// 	.setThumbnail(user.displayAvatarURL())
		// 	.setColor(color);
    return msg.channel.send(description);
    
	}
};

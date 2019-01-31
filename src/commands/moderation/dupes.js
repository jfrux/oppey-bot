const Command = require('../../structures/Command');
const { MessageEmbed, Collection } = require("discord.js");
const moment = require("moment");
const DATE_FORMAT = "MM/DD/YYYY hh:mm:ss a";
module.exports = class PruneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dupes',
			group: 'moderation',
			memberName: 'dupes',
			userPermissions: ['ADMINISTRATOR'],
			description: 'Lists duplicate usernames...',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
		});
	}

	async run(msg) {
		// try {
    const users = await this.client.users;
    let seen_users = new Collection();
    let dupe_users = new Collection();
    users.forEach((user) => {
      let foundUser = seen_users.find(foundUser => foundUser.username === user.username);
      if (foundUser) {
        foundUser.dupeUser = user;
        dupe_users.set(user.id, foundUser);
      }
      seen_users.set(user.id, user);
    });
    let duped_users = dupe_users.sort((a, b) => {
      console.log("username:", a.username);
      if (a.username > b.username) {
        return 1;
      } else if (a.username < b.username) {
        return -1;
      } else if (a.username === b.username) {
        return 0;
      }
    }).each((user) => {
      const dupeEmbed = new MessageEmbed()
      dupeEmbed.setAuthor(`${user.username}#${user.discriminator}`,user.displayAvatarURL())
        .setColor("#000000")
        .setDescription(`${moment(user.createdAt).format(DATE_FORMAT)}
\`${this.client.commandPrefix}kick ${user.id} duplicate profile\``)
      
      const dupeEmbed2 = new MessageEmbed()
      dupeEmbed2.setAuthor(`${user.dupeUser.username}#${user.dupeUser.discriminator}`,user.dupeUser.displayAvatarURL())
        .setColor("#FF0000")
        .setDescription(`${moment(user.dupeUser.createdAt).format(DATE_FORMAT)}
\`${this.client.commandPrefix}kick ${user.id} duplicate profile\``)
      console.log(`Sending embed for ${user.username}#${user.discriminator}`);
      msg.channel.send(dupeEmbed)
      console.log(`Sending embed for ${user.dupeUser.username}#${user.dupeUser.discriminator}`);
      msg.channel.send(dupeEmbed2);
    })
  }
};
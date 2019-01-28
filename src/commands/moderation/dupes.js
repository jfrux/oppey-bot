const Command = require('../../structures/Command');

module.exports = class PruneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dupes',
			group: 'moderation',
			memberName: 'dupes',
			description: 'Lists duplicate usernames...',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES'],
			userPermissions: ['KICK_MEMBERS']
		});
	}

	async run(msg) {
		// try {
    const users = await this.client.users;
    let seen_users = new Collection();
    let dupe_users = new Collection();
    users.forEach((user) => {
        if (seen_users.includes(user.username)) {
          dupe_users.push(user.username);
        }
        seen_users.set(user.id, {
          username: user.username,
          lastMessage: user.lastMessage,
          lastMessageDate: user.lastMessage ? user.lastMessage.createdAt : null
        });
    });
    msg.channel.send(dupe_users.join(", "))
      // users.map((user) => { return user.username });
      // // If the member is in the guild
      // if (member) {
      //   await member.kick(reason)
      // }
			// return msg.channel.send(`${user} has been kicked from the server.`);
		// } catch (err) {
      // console.log(err);
			// return msg.reply(`I was unable to kick ${user} from the server.`);
		// }
	}
};
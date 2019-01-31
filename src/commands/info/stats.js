const Command = require('../../structures/Command');
const moment = require('moment');
const { version } = require('discord.js');

module.exports = class ServerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			group: 'info',
			memberName: 'stats',
      hidden: true,
			description: 'Responds with stats on the server.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
    msg.channel.send(`= STATISTICS =
  • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime     :: ${duration}
  • Users      :: ${this.client.users.size.toLocaleString()}
  • Servers    :: ${this.client.guilds.size.toLocaleString()}
  • Channels   :: ${this.client.channels.size.toLocaleString()}
  • Discord.js :: v${version}
  • Node       :: ${process.version}`, {code: 'asciidoc'});
	}
};
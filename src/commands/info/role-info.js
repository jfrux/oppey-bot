const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { util: { permissions } } = require('discord.js-commando');

module.exports = class RoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-info',
			group: 'info',
      hidden: true,
			memberName: 'role-info',
			description: 'Responds with detailed information on a role.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'role',
					prompt: 'Which role would you like to get information on?',
					type: 'role'
				}
			]
		});
	}

	run(msg, { role }) {
		const serialized = role.permissions.serialize();
    const perms = Object.keys(permissions).filter(perm => serialized[perm]);
    const members = role.members;
		const embed = new MessageEmbed()
			.setColor(role.hexColor)
      .addField('Role Name', role.name, true)
      .addField('Total Members', members.size)
			.addField('Discord ID', role.id, true)
			.addField('Color', role.hexColor.toUpperCase(), true)
			.addField('Creation Date', moment.utc(role.createdAt).format('MM/DD/YYYY h:mm A'), true)
			.addField('Show Separate In List', role.hoist ? 'Yes' : 'No', true)
			.addField('Mentionable', role.mentionable ? ':' : 'No', true)
			.addField('Permissions', perms.map(perm => permissions[perm]).join(', ') || 'None');
		return msg.embed(embed);
	}
};

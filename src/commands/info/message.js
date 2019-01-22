const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class MessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'message',
			aliases: ['message-info', 'msg', 'msg-info', 'reply'],
			group: 'info',
			memberName: 'message',
			description: 'Responds with detailed information on a message.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'message',
					prompt: 'Which message would you like to get information on?',
					type: 'message'
				}
			]
		});
	}

	run(msg, { message }) {
		const format = message.author.avatar && message.author.avatar.startsWith('a_') ? 'gif' : 'png';
		const embed = new MessageEmbed()
			.setColor(message.member ? message.member.displayHexColor : 0x00AE86)
			.setThumbnail(message.author.displayAvatarURL({ format }))
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ format }))
			.setDescription(message.content)
			.setTimestamp(message.createdAt)
			.setFooter(`ID: ${message.id}`)
			.addField('❯ Jump', message.url);
		return msg.embed(embed);
	}
};

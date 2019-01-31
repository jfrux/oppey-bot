const commando = require('discord.js-commando');

module.exports = class linkifyCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'linkify',
            group: 'util',
            aliases: ['link', 'imglink'],
            memberName: 'linkify',
            description: 'Create a discord cdn link from an attachment - for mobile',
            examples: ['linkify while sending a message with an attachment'],
            guildOnly: false
        });
    }

    async run(msg) {
        msg.attachments.first() !== undefined && msg.attachments.first().url !== undefined ? msg.say(msg.attachments.first().url) : msg.delete()
    };
};
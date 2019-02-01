const Command = require('../../structures/Command.js');
const { oneLine } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      group: 'moderation',
      memberName: 'prune',
      userPermissions: ['MANAGE_MESSAGES'],
      description: 'Deletes a specific number of messages.',
      details: oneLine`
        This command deletes a specific number of messages.
        Can only delete between 1 and 99 messages at a time due to Discord ratelimits.
			`,
      examples: ['prune 25'],
      args: [{
        key: 'toPurge',
        label: 'prune',
        prompt: 'how many messages?',
        type: 'float',
        validate: text => {
          if (text <= 99 && text >= 1) return true;
          return 'You can only delete 1-99 messages at a time!';
        },
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    });
  }

  async run(message, args) {
    const modrole = await message.guild.settings.get('modrole');
    const adminrole = await message.guild.settings.get('adminrole');
    const modlog = await message.guild.settings.get('modlog');
    if (!modrole || !adminrole || !modlog) return message.reply(`Configuration missing. Command not available.`);
    if (!message.member.roles.has(modrole)) {
      if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this!`);
    }
    let deleted = await message.channel.bulkDelete(args.toPurge+1);
  }
};

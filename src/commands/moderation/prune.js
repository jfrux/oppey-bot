const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      aliases: ['apocalypse', 'clear', 'clean'],
      group: 'moderation',
      memberName: 'prune',
      userPermissions: ['MANAGE_MESSAGES'],
      description: 'Deletes a specific number of messages.',
      details: oneLine`
        This command deletes a specific number of messages.
        Can only delete between 2 and 99 messages at a time due to Discord ratelimits.
			`,
      examples: ['prune 25'],
      args: [{
        key: 'toPurge',
        label: 'prune',
        prompt: 'how many messages?',
        type: 'float',
        validate: text => {
          if (text <= 99 && text > 2) return true;
          return 'You can only delete 2-99 messages at a time!';
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
    if (!modrole || !adminrole || !modlog) return message.reply(`This command is not set up to work! Have someone run \`${message.guild.commandPrefix}settings\` to add the \`mod\`, \`admin\`, and \`modlog\` settings.`);
    if (!message.member.roles.has(modrole)) {
      if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${message.guild.roles.get('modrole')}\`, this is changeable with \`${message.guild.commandPrefix}set add mod @role\``);
    }
    let purgingMessage = await message.channel.send(`:clock: Purging the last ${args.toPurge+1} messages from the channel.`);
    let deleted = await message.channel.bulkDelete(args.toPurge + 1);
    message.channel.send(`:fire: I removed the last ${args.toPurge+1} messages from the channel.`)
  }
};

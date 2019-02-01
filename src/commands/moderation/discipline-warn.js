const Command = require('../../structures/Command.js');
const { oneLine } = require('common-tags');
const { MessageEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      group: 'moderation',
      memberName: 'warn',
      userPermissions: ['KICK_MEMBERS'],
      description: 'Warns a user.',
      details: oneLine`
        Warning a user is useful for minor, first time issues.
        This command warns a user, DMs the user warned, and posts in the mod log channel.
        Permission is locked to moderators and above.
			`,
      examples: ['warn @Bob being a bad apple'],
      args: [{
        key: 'user',
        label: 'user',
        wait: 0,
        prompt: 'Who would you like to warn? Please mention one only.',
        type: 'user',
        infinite: false
      },
      {
        key: 'reason',
        wait: 0,
        label: 'reason',
        prompt: 'Why is the user being warned?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true
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
    args.user.send(`:oncoming_police_car:`);
    args.user.send(`**WOOOP WOOOP! Oppey here...**
I just figured I'd give you a friendly heads up...
One of our community staff have placed a warning alert on your profile due to the following:
\`\`\`diff
- ${args.reason}
\`\`\`
Please avoid this behavior as we want to keep the community clean and fun for everyone.`).catch(console.error);
    const embed = new MessageEmbed()
      .setTitle(':bangbang: **Moderation action** :scales:')
      .setAuthor(`${message.author.username} (${message.author.id})`, `${message.author.displayAvatarURL()}`)
      .setColor(0xFFFF00)
      .setDescription(`**Action:** Warning \n**User:** ${args.user.username} (${args.user.username}) \n**Reason:** ${args.reason}`)
      .setTimestamp();
    message.delete(1);
    message.guild.channels.get(modlog).send({
      embed
    });
  }
};

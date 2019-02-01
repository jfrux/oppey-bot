const Command = require('../../structures/Command.js');
const { oneLine, stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      group: 'moderation',
      memberName: 'kick',
      userPermissions: ['KICK_MEMBERS'],
      description: 'Kicks a user.',
      details: oneLine`
        Kicking is a powerful moderation tool with many applications.
        This command kicks a user and logs the moderator's reason for doing so.
        Permission is locked to moderators and above.
      `,
      aliases: ['remove'],
      examples: ['kick @Bob being a bad apple'],
      args: [{
        key: 'user',
        label: 'user',
        prompt: 'Who would you like to kick? Please mention one only.',
        type: 'user'
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being kicked?',
        type: 'string'
      }],
      guildOnly: false
    });
  }

  async run(message, args) {
    const modrole = await message.guild.settings.get('modrole');
    const adminrole = await message.guild.settings.get('adminrole');
    const modlog = await message.guild.settings.get('modlog');
    if (!modrole || !adminrole || !modlog) return message.reply(`This command is not able to run due to missing settings.`);
    if (!message.member.roles.has(modrole)) {
      if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command!`);
    }
    if (!message.guild.member(this.client.user).hasPermission('KICK_MEMBERS')) return message.reply('I do not have permission to kick members!');
    try {
      const guildMember = message.guild.member(args.user);
      await guildMember.send(stripIndents`You have been removed from the server "${message.guild}"!
      Staff member: ${message.author.username}
      Reason: "${args.reason}"`).catch(console.error);
      // if (!guildMember) return message.reply(`That user is no longer in the server.`);
      await guildMember.kick(`${args.reason} -${message.author.username}`);
      
      const embed = new MessageEmbed()
        .setTitle(':bangbang: **Moderation action** :scales:')
        .setAuthor(`${message.author.username} (${message.author.id})`, `${message.author.displayAvatarURL()}`)
        .setColor(0x990073)
        .setDescription(`**Action:** Kick \n**User:** ${guildMember.user.username} (${guildMember.user.id}) \n**Reason:** ${args.reason}`)
        .setTimestamp();
      // message.delete(1);
      message.guild.channels.get(modlog).send({
        embed
      });
      message.channel.send(`${guildMember.user} was removed from the server due to:
\`\`\`
${args.reason}
\`\`\`
`);
    } catch (err) {
      message.reply(stripIndents`There was an error!
      \`\`\`${err}\`\`\``);
      console.error(err);
    }
  }
};

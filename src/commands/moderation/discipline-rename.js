const Command = require('../../structures/Command.js');
const { oneLine, stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rename',
      group: 'moderation',
      userPermissions: ['KICK_MEMBERS'],
      memberName: 'rename',
      description: 'Renames and notifies a user why their nick has been changed.',
      details: stripIndents`
        Renaming a user's nickname is important to maintaining our community guidelines.
        If a user is using a name that violates one of the guidelines, use this command 
        to rename and notify them via DM that their name has been updated and why.
			`,
      examples: ['rename @SweetRide[2017 Honda Civic] SweetRide "User/nick name contains vehicle info"'],
      args: [{
        key: 'user',
        label: 'user',
        wait: 30,
        prompt: 'Who would you like to rename?',
        type: 'user',
        infinite: false
      },
      {
        key: 'nickname',
        label: 'nickname',
        wait: 30,
        prompt: 'What would you like their new name to be?',
        type: 'string',
        infinite: false
      },
      {
        key: 'reason',
        wait: 30,
        label: 'reason',
        prompt: 'Why is the user being renamed?',
        type: 'string',
        default: ``,
        infinite: false
      }],
      guildOnly: true
    });
  }

  async run(message, {user, nickname, reason}) {
    const modrole = await message.guild.settings.get('modrole');
    const adminrole = await message.guild.settings.get('adminrole');
    const modlog = await message.guild.settings.get('modlog');
    if (!modrole || !adminrole || !modlog) return message.reply(`Command failed, configuration missing.`);
    if (!message.member.roles.has(modrole)) {
      if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${modrole}\`, this is changeable with \`${message.guild.commandPrefix}set add mod @role\``);
    }
    let messageContent = stripIndents`**WOOOP WOOOP! Oppey here...**
    I just figured I'd give you a friendly heads up...
    One of our community staff have changed your nickname as it has violated one of our community guidelines found here:
    https://discordapp.com/channels/469524606043160576/539127103853953038/539128194935160844`;

    messageContent = stripIndents`${messageContent}
    Your nickname is now ${nickname}`;

    if (reason.length) {
      messageContent = stripIndents`${messageContent}
      Here is the reason they specified...
      \`\`\`diff
      - ${reason}
      \`\`\``
    }

    messageContent = stripIndents`${messageContent}
    If you have additional concerns, please feel free to reach out to us on #discord-server-admin within Comma.ai Community Discord.`;
    
    user.send(`:oncoming_police_car:`);
    await user.send(messageContent);

    const embed = new MessageEmbed()
      .setTitle(':oncoming_police_car: Moderation Action')
      .setAuthor(`${message.author.username} (${message.author.id})`, `${message.author.displayAvatarURL()}`)
      .setColor(0xFFFF00)
      .setDescription(`**Action:** Renamed \n**User:** ${user.username} (${user.username}) \n**Reason:** ${reason}`)
      .setTimestamp();
    await message.delete(5000);
    let modLogChannel = await message.guild.channels.get(modlog);
    modLogChannel.send({
      embed
    });
  }
};

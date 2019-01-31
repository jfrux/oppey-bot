const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class QuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'quote',
      group: 'info',
      hidden: true,
      memberName: 'quote',
      description: 'Quotes a specified user.',
      details: oneLine`
        Quote the last messages of a user.
			`,
      examples: ['quote @Bob#1234'],
      args: [{
        key: 'user',
        label: 'user',
        prompt: 'What user would you like to quote? Please specify one only.',
        type: 'user',
        infinite: false
      }],
      guarded: true
    });
  }

  async run(message, {user}) {
    const quoteUser = user;
    const messages = await message.channel.messages.fetch({ limit: 100 });
      
    const collected = messages.array().filter(fetchedMsg => fetchedMsg.author.id === user.id);
    const msgs = collected.map((m) => {
      return `**${user.username}#${user.discriminator}:** ${m.content}`;
    });
    // if (msgs.size < 10) return message.reply('This user does not have enough recent messages!');
    // TODO Use a loop to generate this
    
    const quotes = msgs.join("\n");
    // const embed = new MessageEmbed()
    //   .setTitle('**Quotes**')
    //   .setAuthor(quoteUser.username, quoteUser.avatarURL)
    //   .setColor(0x00CCFF)
    //   .setDescription()
    //   .setTimestamp();
    message.channel.send(quotes, {
      split: true
    });
  }
};
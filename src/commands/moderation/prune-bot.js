const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class PruneCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prune-bot',
      group: 'moderation',
      memberName: 'prune-bot',
      description: 'Deletes messages sent by the bot.',
      details: oneLine`
        Deletes a specified number of messages sent by the bot.
        Fairly self-explanitory, yes?
			`,
      examples: ['prune-bot 5'],
      args: [{
        key: 'toPrune',
        label: 'amount',
        prompt: 'How many messages?',
        type: 'float',
        infinite: false
      }]
    });
  }

  async run(message, args) {
    const messagecount = args.toPrune;
    const messages = await message.channel.messages.fetch({ limit: 100 });
    let msgArray = messages.array();
    console.log("msgArray:",msgArray);
    msgArray = msgArray.filter(m => {
      console.log("messageAuthor:",m.author.id);
      console.log("clientId:",this.client.user.id);
      return m.author.id === this.client.user.id;
    });
    console.log("msgArray:",msgArray);
    msgArray.length = messagecount + 1;
    msgArray.map(m => m.delete().catch(console.error));
    message.channel.send(`:fire: I'm removing **__my__** last ${messagecount} messages.`);

  }
};

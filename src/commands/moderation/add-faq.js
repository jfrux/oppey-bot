const Discord = require("discord.js");
const Command = require('../../structures/Command');
const moment = require("moment");
const inflection = require("inflection");
const uuidv4 = require('uuid/v4');
const Markdown = require('turndown')
const markdown = new Markdown();
module.exports = class AddFaqCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-faq',
			group: 'moderation',
			memberName: 'add-faq',
			description: 'Adds a new FAQ.',
      example: [ "add-faq (this uses prompts instead of inline)", "add-faq 'What is an EON?' 'It\'s a cool device!" ],
			args: [
				{
					key: 'question',
					prompt: `What is the question?`,
          type: 'string'
        },
        {
					key: 'answer',
					prompt: `What is the answer?`,
          type: 'string'
        }
			]
		});
	}

	async run(message, { question, answer }) {
    try {
      const client = this.client;
      const Guide = client.orm.Model('Guide');
      console.dir(Guide);
      const newGuide = await Guide.create({
        title: question,
        markdown: answer,
        markup: markdown.turndown(answer),
        slug: uuidv4(),
        type: 'Faq',
        author_name: message.author.username,
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });
      console.dir(newGuide);
      let pageImage = "https://opc.ai/fluidicon.png";
      let pageUrl = "https://opc.ai/faqs/" + newGuide.slug;
      let embed = new Discord.MessageEmbed();
      embed
        .setTitle(question)
        .setAuthor('Openpilot Community',pageImage)
        .setColor("#000000")
        .setURL(pageUrl)
        .setDescription(`${answer.slice(0, 150)}
        [Read more](${pageUrl})`)

        // await msg.edit(msg.content,wikiEmbed);
        // msg.embeds.push(wikiEmbed);
        message.channel.send(embed);
    }catch (e) {
      console.error(e);
      message.channel.send("Could not create the FAQ, try again later!");
    }
  }
}
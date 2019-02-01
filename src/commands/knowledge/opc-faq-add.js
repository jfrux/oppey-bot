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
			group: 'knowledge',
      userPermissions: ['MANAGE_MESSAGES'],
			memberName: 'add-faq',
			description: 'Adds a new FAQ.',
      example: [ "add-faq (this uses prompts instead of inline)", "add-faq 'What is an EON?' 'It\'s a cool device!" ],
			args: [
				{
					key: 'question',
					prompt: `What is the question?\n*Note: Must end in ? and be a min. of 25 characters.*`,
          type: 'string',
          validate: text => {
            text = text.trim();
            if (text.endsWith('?') && text.length >= 15) return true;
            return "The question must end in '?' and must be at least 15 characters."
          }
        },
        {
					key: 'answer',
					prompt: `What is the answer?\n*Note: min. of 2 characters.*`,
          type: 'string',
          validate: text => {
            text = text.trim();
            if (text.length > 2) return true;
            return "The answer must be at least 2 characters."
          }
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
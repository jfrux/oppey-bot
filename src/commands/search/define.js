const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const { WORDNIK_KEY } = process.env;

module.exports = class DefineCommand extends Command {
	constructor(client) {
		super(client, {
      name: 'define',
      hidden: true,
			aliases: ['dictionary', 'wordnik'],
			group: 'search',
			memberName: 'define',
			description: 'Defines a word.',
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to look up?',
					type: 'string',
					parse: word => encodeURIComponent(word)
				}
			]
		});
	}

	async run(msg, { word }) {
		try {
			const resp = await fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=true&api_key=${WORDNIK_KEY}`,{
        headers:{
          'Content-Type': 'application/json'
        }
      });
      const body = await resp.json();
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			return msg.say(stripIndents`
				**${data.word}**
				(${data.partOfSpeech || 'unknown'}) ${data.text}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
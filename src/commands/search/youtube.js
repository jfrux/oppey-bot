const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const { GOOGLE_KEY } = process.env;
const search = require("youtube-search");
var opts = {
  maxResults: 1,
  key: GOOGLE_KEY
};
module.exports = class DefineCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['yt'],
			group: 'search',
			memberName: 'youtube',
			description: 'Returns a YouTube Video',
			args: [
				{
					key: 'query',
					prompt: 'What do you want to watch?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
      search(query, opts, (err, results) => {
        if(err) return console.log(err);
        if (results.length) {
          return msg.channel.send(results[0].link);
        } else {
          return msg.channel.send(`No results found for **${query}**`)
        }
      });
			// const resp = await fetch(`https://api.wordnik.com/v4/word.json/${query}/definitions?limit=1&includeRelated=false&useCanonical=true&api_key=${WORDNIK_KEY}`,{
      //   headers:{
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const body = await resp.json();
			// if (!body.length) return msg.say('Could not find any results.');
			// const data = body[0];
			// return msg.say(stripIndents`
			// 	**${data.word}**
			// 	(${data.partOfSpeech || 'unknown'}) ${data.text}
			// `);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
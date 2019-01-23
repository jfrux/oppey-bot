const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const querystring = require('querystring');
const { GOOGLE_KEY, GOOGLE_CUSTOM_SEARCH_ID } = process.env;

module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			aliases: ['s','find','lookup'],
			group: 'search',
			memberName: 'search',
			description: 'Searches for relevant content from the community returning the top result.',
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search for?',
					type: 'string',
					validate: query => {
						if (encodeURIComponent(query).length < 1950) return true;
						return 'Invalid query, your query is too long.';
					}
				}
			]
		});
	}

	async run(msg, { query }) {
		let href;
		const nsfw = msg.channel.nsfw || false;
		// try {
		// 	href = await this.searchGoogle(query, nsfw);
		// } catch (err) {
    //   console.log(err);
		// 	try {
				
		// 	} catch (err2) {
    //     console.log(err2);
		// 		href = `http://lmgtfy.com/?iie=1&q=${encodeURIComponent(query)}`;
		// 	}
    // }
    href = await this.customSearch(query, nsfw);
    if (!href) return msg.channel.send('Could not find any results.');
    console.log("href:",href);
		return msg.channel.send(href);
	}

	async searchGoogle(query, nsfw) {
    console.log("searchingGoogle:",query);
		const { text } = await request
			.get('https://www.google.com/search')
			.query({
				safe: nsfw ? 'off' : 'on',
				q: query
			});
		const $ = cheerio.load(text);
		let href = $('.r').first().find('a').first().attr('href');
		if (!href) return null;
		href = querystring.parse(href.replace('/url?', ''));
		return href.q;
	}

	async customSearch(query, nsfw) {
    console.log("customSearch:",query);
		const { body } = await request
			.get('https://www.googleapis.com/customsearch/v1')
			.query({
				key: GOOGLE_KEY,
				cx: GOOGLE_CUSTOM_SEARCH_ID,
				safe: nsfw ? 'off' : 'active',
				q: query
			});
		if (!body.items) return null;
		return body.items[0].formattedUrl;
	}
};
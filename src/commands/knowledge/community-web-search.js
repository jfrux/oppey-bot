const Discord = require("discord.js");
const Command = require('../../structures/Command');
const request = require('node-superfetch');
// const cheerio = require('cheerio');
const Markdown = require('turndown')
const markdown = new Markdown();
const querystring = require('querystring');
const { GOOGLE_KEY, GOOGLE_CUSTOM_SEARCH_ID } = process.env;

module.exports = class CommunityWebSearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			aliases: ['s','find','lookup'],
			group: 'knowledge',
			memberName: 'search',
			description: 'Searches for relevant content from the community returning the top result from opc.ai and community.comma.ai.',
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
    let searchEmbed = await this.customSearch(query, nsfw);
    if (!searchEmbed) return msg.channel.send('Could not find any results.');
    // console.log("searchEmbed:",searchEmbed);
		return msg.channel.send(searchEmbed);
	}

	// async searchGoogle(query, nsfw) {
  //   console.log("searchingGoogle:",query);
	// 	const { text } = await request
	// 		.get('https://www.google.com/search')
	// 		.query({
	// 			safe: nsfw ? 'off' : 'on',
	// 			q: query
	// 		});
	// 	const $ = cheerio.load(text);
	// 	let href = $('.r').first().find('a').first().attr('href');
	// 	if (!href) return null;
	// 	href = querystring.parse(href.replace('/url?', ''));
	// 	return href.q;
	// }

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
    const firstResult = body.items[0];
    const searchEmbed = new Discord.MessageEmbed();
    let pageThumbnail;
    let pageImage;
    if (firstResult.pagemap && firstResult.pagemap.cse_image && firstResult.pagemap.cse_image.length) {
      pageImage = firstResult.pagemap.cse_image[0].src;
    }
    

    if (!pageImage) {
      if (firstResult.pagemap && firstResult.pagemap.cse_thumbnail && firstResult.pagemap.cse_thumbnail.length) {
        pageThumbnail = firstResult.pagemap.cse_thumbnail[0].src;
      }

      if (!pageThumbnail) {
        pageThumbnail = "https://community.comma.ai/wiki/resources/assets/comma.gif";
      }
    }

    searchEmbed.type = 'link';
    searchEmbed
      .setTitle(markdown.turndown(firstResult.htmlTitle),encodeURI(pageImage))
      .setColor("#000000")
      .setURL(firstResult.link)
      .setDescription(markdown.turndown(firstResult.htmlSnippet))
      .setFooter(firstResult.displayLink)
    if (pageImage) {
      searchEmbed.setImage(pageImage);
    }
    if (pageThumbnail) {
      searchEmbed.setThumbnail(pageThumbnail);
    }

		return searchEmbed;
	}
};
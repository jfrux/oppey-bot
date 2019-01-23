const Discord = require("discord.js");
const commando = require('discord.js-commando');
const h2p = require('html2plaintext')
const Promise = require("bluebird");
const MediaWiki = require('nodemw');
const moment = require("moment");
const Markdown = require('turndown')
const markdown = new Markdown();
const path = require("path");
const inflection = require("inflection");

const commaWiki = new MediaWiki({
  server: 'community.comma.ai',
  path: '/wiki',
  protocol: 'https', 
  debug: true
})

Promise.promisifyAll( commaWiki );
module.exports = class WikiCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'wiki',
      group: 'search',
      memberName: 'wiki',
      description: 'Search the Comma.ai Wiki and return top result.',
      examples: ['wiki Giraffe', 'wiki Install Openpilot'],
      guildOnly: false,
      args: [{
        key: 'query',
        prompt: 'What would you like to search for in the Comma Wiki?',
        type: 'string'
      }]
    });

    this.baseWikiUrl = "https://community.comma.ai/wiki/index.php/";
  }
  async run(msg, {query}) {
      const results = await commaWiki.getAllAsync(
        {
          action: 'query',
          list: 'search',
          srsearch: query,
          srprop: 'timestamp|snippet',
          srlimit: 5000
        },
        'search'
      );
      const firstResult = results[0];
      const pageTitle = firstResult.title;
      const pageSnippet = firstResult.snippet;
      const pageTimestamp = firstResult.timestamp;
      const pageContent = await commaWiki.getArticleAsync(pageTitle);
      const pageImages = await commaWiki.getImagesFromArticleAsync(pageTitle);
      let pageImage = "https://community.comma.ai/wiki/resources/assets/comma.gif";
      if (pageImages.length) {
        pageImage = pageImages[0].url;
      }
      console.dir(pageImages);
      const parsed = await commaWiki.parseAsync(pageContent,pageTitle);
      // const parsedMd = markdown.turndown(parsed);
      const parsedPlainText = h2p(parsed).replace(/\n/g,'');
      const pageUrl = encodeURI(this.baseWikiUrl + pageTitle);
      const wikiEmbed = new Discord.MessageEmbed();
      console.log("Wiki URL:",pageUrl);
      console.log("Image URL:",pageImage);
      wikiEmbed
      .setTitle(pageTitle)
      .setAuthor('Comma.ai Wiki',pageImage)
      .setColor("#000000")
      .setURL(pageUrl)
      .setDescription(`${parsedPlainText.slice(0, 150)}
      [Read more](${pageUrl})`)
      // .setThumbnail(encodeURI(pageImage))
      .setFooter(`Page last updated ${moment(pageTimestamp).format('MMMM Do YYYY HH:mm:ss')}`)

      // await msg.edit(msg.content,wikiEmbed);
      // msg.embeds.push(wikiEmbed);
      msg.channel.send(wikiEmbed);
  }
};
const Discord = require("discord.js");
const commando = require('discord.js-commando');
const moment = require('moment');
const superagent = require('superagent');

module.exports = class wikipediaCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'wiki',
            group: 'search',
            memberName: 'wiki',
            description: 'Get info from a Comma.ai Wiki page',
            examples: ['wiki {thing}', 'wiki Install Openpilot'],
            guildOnly: false,

            args: [{
                key: 'input',
                prompt: 'What page do you want to get info from?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        superagent.get(
                `https://community.comma.ai/wiki/api.php?action=query&list=search&srwhat=text&srprop=sectionsnippet&format=json&srsearch=${args.input}`
            )
            .then((res) => res.body.query.search)
            .then((results) => {
                if (!results[0]) return Promise.reject('NO RESULTS');
                return results[0];
            })
            .then((result) => superagent.get(
                `https://community.comma.ai/wiki/api.php?format=json&action=query&titles=${encodeURIComponent(result.title)}`
            ))
            .then((res) => res.body.query.pages[Object.keys(res.body.query.pages)])
            .then((page) => {
                const url = `https://community.comma.ai/wiki/${encodeURIComponent(page.title)}`;
                const wikiData = {
                    url: url,
                    pageTitle: page.title,
                    pageExtract: `${page.extract.substring(0, 500)}... [Read more](${url.replace(/\(/, '%28').replace(/\)/, '%29')})`
                }
                return wikiData
            })
            .then((wikiData) => {
                const wikiEmbed = new Discord.RichEmbed();
                wikiEmbed
                    .setAuthor(`Comma.ai Wiki - ${wikiData.pageTitle}`, "https://favna.s-ul.eu/dYdFA880")
                    .setColor("#FF0000")
                    .setFooter(`Comma.ai Wiki result pulled on ${moment().format('MMMM Do YYYY HH:mm:ss')}`)
                    .setURL(wikiData.url)
                    .setDescription(wikiData.pageExtract);
                msg.embed(wikiEmbed, wikiData.url);
            })
            .catch((err) => {
                console.error(err);
                msg.reply('**No results found!**');
            });
    }
};
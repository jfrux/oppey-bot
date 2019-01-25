const Discord = require("discord.js");
const RC = require('reaction-core');
Discord.TextChannel.prototype.sendMenu = async function (menu) {
  return new Promise((resolve, reject) => {
    if (menu instanceof RC.Menu) {
      let sendMessage = { }
      if (typeof menu.text === 'string') {
        sendMessage = menu.text
      } else {
        sendMessage = { embed: menu.text }
      }
      this.send(sendMessage).then(async message => {
        for (let button in menu.buttons) {
          await message.react(button).catch(console.error)
        }
        menu.register(message)
        resolve(message)
      })
    } else this.send(menu).then(message => resolve(message))
  })
}
const { CommandoClient } = require('discord.js-commando');
const { OPPEY_PREFIX, DATABASE_URL } = process.env;
const { WebhookClient, Collection } = require('discord.js');
const moment = require("moment");
const Database = require('./PostgreSQL.js');
const models = require("../util/models.js");
// const Redis = require('./Redis');
const winston = require('winston');
module.exports = class OppeyClient extends CommandoClient {
	constructor(options) {
    super(options);
    this.prefix = OPPEY_PREFIX;
    this.newUsers = new Collection();
    this.menuHandler = new RC.Handler()
    this.nextWelcomeMessageTime = moment();
    this.minutesBetweenEachWelcome = 5;
		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY hh:mma' }),
				winston.format.printf(log => `[oppey-bot][${log.timestamp}] ${log.message}`)
			)
    });
    

    this.database = Database.db;
    Database.start();
    // Redis.start();
	}
};
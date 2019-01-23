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

// class Oppey extends CommandoClient {
// 	constructor(options) {
// 		super({
//       name: 'Oppey',
//       token: config.token,
//       pause: true,
//       localeDir: path.join(__dirname, 'lang'),
// 			statusText: `opc.ai | Try -help`,
// 			readyText: 'Oppey is ready for service!',
//       commandsDir: path.join(__dirname, 'commands'),
//       // plugins: [commandUsage("533856957707190302")],
//       provider: Providers.PostgresProvider(process.env.DATABASE_URL, true),
//     });
//     this.webhook = new WebhookClient(OPPEY_WEBHOOK_ID, OPPEY_WEBHOOK_TOKEN, { disableEveryone: true });
//     this.nextWelcomeMessageTime = moment();
//     this.minutesBetweenEachWelcome = 5;
//     this.newUsers = new Collection();
// 		this.on('pause', async () => {
//       const evtFiles = await readdir(path.join(__dirname, "events"));
//       evtFiles.forEach(async (file) => {
//         const eventName = file.split(".")[0];
//         // client.logger.log(`Loading Event: ${eventName}`);
//         const event = new (require(`./events/${file}`))(this);
//         // This line is awesome by the way. Just sayin'.
//         this.on(eventName, (...args) => event.run(...args));
//         delete require.cache[require.resolve(`./events/${file}`)];
//       });
//       await this.setDefaultSetting('prefix', config.defaultSettings.prefix);
//       this.continue();
//     });

// 		this.once('clientReady', () => {
//       // this.user.setAvatar("./avatar.gif");
// 			console.log(`Client ready! Serving Comma.ai ${this.guilds.size}`);
// 		});
// 	}
// }
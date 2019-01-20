const path = require("path");
const { Client, Providers } = require('@yamdbf/core');
const { Collection } = require("discord.js");
const moment = require("moment");
const { commandUsage } = require('@yamdbf/command-usage');
// const { Providers } = require("")
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const config = require('../config.js');
// const excludedBaseClasses = [
//   "request"
// ];
class Oppey extends Client {
	constructor()
	{
		super({
      name: 'Oppey',
      token: config.token,
      pause: true,
			statusText: 'try @mention help',
			readyText: 'Oppey is ready for service!',
      commandsDir: path.join(__dirname, 'commands'),
      // plugins: [commandUsage("533856957707190302")],
      provider: Providers.PostgresProvider(process.env.DATABASE_URL, true),
    });
    this.nextWelcomeMessageTime = moment();
    this.minutesBetweenEachWelcome = 5;
    this.newUsers = new Collection();
		this.on('pause', async () => {
      const evtFiles = await readdir(path.join(__dirname, "events"));
      evtFiles.forEach(async (file) => {
        const eventName = file.split(".")[0];
        // client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(this);
        // This line is awesome by the way. Just sayin'.
        this.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
      });
      await this.setDefaultSetting('prefix', config.defaultSettings.prefix);
      this.continue();
    });

		this.once('clientReady', () => {
      // this.user.setAvatar("./avatar.gif");
			console.log(`Client ready! Serving Comma.ai ${this.guilds.size}`);
		});
	}
}
const client = new Oppey().start();
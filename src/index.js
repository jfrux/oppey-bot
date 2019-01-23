require('dotenv').config();

const { OPPEY_TOKEN, OWNERS, OPPEY_PREFIX, INVITE, DATABASE_URL, OPPEY_WEBHOOK_ID, OPPEY_WEBHOOK_TOKEN } = process.env;
const path = require("path");
const { Collection } = require("discord.js");
const moment = require("moment");
const { promisify } = require("util");
const readdir = require("fs").readdirSync;
const config = require('../config.js');
const Client = require('./structures/Client');
const SequelizeProvider = require("./structures/SequelizeProvider.js");
const client = new Client({
  name: "Oppey - the openpilot ",
	commandPrefix: OPPEY_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});
client.setProvider(new SequelizeProvider(client.database));
client.registry
  .registerDefaults()
  .registerGroups([
		['tool', 'Tools'],
		['info', 'Discord Information'],
		['chat', 'Chat'],
		['database', 'Openpilot Database'],
		['search', 'Search'],
		['me', 'Manage Your Info'],
		['moderation', 'Moderation Commands'],
		['other', 'Other']
  ])
  .registerCommandsIn(path.join(__dirname, "commands"))
	.registerTypesIn(path.join(__dirname, 'types'))
const onNewMember = require("./events/guildMemberAdd.js");

client.on("guildMemberAdd", (member) => {
  client.logger.info(`[MEMBER] New Member Joined: ${member}`);
	
  return new onNewMember(client).run(member)
});

client.on('ready', () => {
  client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
  
  client.user.setActivity("opc.ai | Try -help", { type: "PLAYING" });
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => client.logger.error(err));

client.on('warn', warn => client.logger.warn(warn));

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(OPPEY_TOKEN);
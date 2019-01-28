require('dotenv').config();


const { OPPEY_TOKEN, OWNERS, OPPEY_PREFIX, INVITE, DATABASE_URL, OPPEY_WEBHOOK_ID, OPPEY_WEBHOOK_TOKEN } = process.env;
const path = require("path");
// const { Collection } = require("discord.js");
// const moment = require("moment");
// const { promisify } = require("util");
// const readdir = require("fs").readdirSync;
// const config = require('../config.js');
const Client = require('./structures/Client');
const Keyv = require('keyv');
const KeyvProvider = require('commando-provider-keyv');
const client = new Client({
  name: "Oppey",
	commandPrefix: OPPEY_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
  disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});
// client.reactionHandler = reactionHandler;

client.setProvider(new KeyvProvider(new Keyv(DATABASE_URL, { table: 'discord_caches' })));
client.on("commandCancelled",(command, reason, message) => {
  message.delete(500);
  return false;
})
client.registry
  .registerDefaults()
  .registerGroups([
		['utilities', 'Utilities'],
		['info', 'Discord Information'],
		['chat', 'Chat'],
		['search', 'Search'],
		['me', 'Manage Your Info'],
		['moderation', 'Moderation Commands'],
		['other', 'Other']
  ])
  .registerCommandsIn(path.join(__dirname, "commands"))
  .registerTypesIn(path.join(__dirname, 'types'));
// client.on('messageReactionAdd', (messageReaction, user) => reactionHandler.handle(messageReaction,user));
const events = [
  "channelCreate",
  "channelDelete",
  "channelUpdate",
  "error",
  "guildBanAdd",
  "guildBanRemove",
  "guildCreate",
  "guildDelete",
  "guildMemberAdd",
  "guildMemberUpdate",
  "guildMemberRemove",
  "guildUpdate",
  "message",
  "messageDelete",
  "messageReactionAdd",
  "messageReactionRemove",
  "messageUpdate",
  "presenceUpdate",
  "ready",
  "roleCreate",
  "roleDelete",
  "roleUpdate",
  "warn"
]

events.forEach((eventName) => {
  const event = require(`./events/${eventName}.js`);
  client.on(eventName, (...args) => event(client, ...args));
});

client.on("messageReactionAdd", (messageReaction, user) => client.menuHandler.handle(messageReaction, user));

client.on('ready', async () => {
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

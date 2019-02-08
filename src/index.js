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
  disableEveryone: true
	// disabledEvents: ['TYPING_START']
});
// client.reactionHandler = reactionHandler;
console.log("DB_URL:",DATABASE_URL);
client.setProvider(new KeyvProvider(new Keyv(DATABASE_URL, { table: 'discord_caches' })));
client.on("commandCancelled",(command, reason, message) => {
  message.delete(500);
  return false;
});

client.on("commandInvalid", (command, message) => {
  console.log("COMMAND INVALID!",message);
  command.reactSentErrorDM(message);
  // setTimeout(() => {
  //   message.delete(500);
  // },10000);
  return false;
});
client.on("commandError", (command, err, message, args, fromPattern) => {
  console.log("COMMAND INVALID!");
  command.reactSentErrorDM(message);
  // setTimeout(() => {
  //   message.delete(500);
  // },10000);
  return false;
});
// client.dispatcher.addInhibitor((message) => message.channel.id === process.env.NUMBER_CHANNEL_ID);

client.registry
  .registerDefaultTypes()
  .registerGroups([
		['me', 'Manage Your Info'],
		['search', 'Search'],
		['chat', 'Chat'],
		['knowledge', 'Knowledge Base'],
		['polls', 'Polls'],
		['moderation', 'Moderation Commands'],
		['info', 'Discord Information'],
    ['commands', 'Commands'],
    ['util', 'Utilities'],
		['experimental', 'Experimental']
  ])
  .registerDefaultCommands({
    help: true,
    prefix: false,
    unknownCommand: false
  })
  .registerCommandsIn(path.join(__dirname, "commands"))
  .registerTypesIn(path.join(__dirname, 'types'));

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

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => client.logger.error(err));

client.on('warn', warn => client.logger.warn(warn));

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(OPPEY_TOKEN);

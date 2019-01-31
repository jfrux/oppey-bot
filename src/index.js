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
  .registerDefaultTypes()
  .registerGroups([
		['me', 'Manage Your Info'],
		['search', 'Search'],
		['chat', 'Chat'],
		['knowledge', 'Knowledge Base'],
		['polls', 'Polls'],
		['moderation', 'Moderation Commands'],
		['github', 'GitHub'],
		['info', 'Discord Information'],
    ['commands', 'Commands'],
    ['util', 'Utilities'],
		['other', 'Other']
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

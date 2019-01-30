const { Command } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client, info) {
		super(client, info);
    console.log("Registering command...", info.name);
	}
};
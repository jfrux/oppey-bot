const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "history",
      memberName: 'history',
      guildOnly: false,
      description: "Search for Discord history from the archives.",
      group: "search",
      usage: "<prefix>history <search>",
      roles: ["Community Member"]
    });
  }
  
  getEndpoint() {
    return '/discord_messages';
  }

}
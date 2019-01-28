const Command = require("../../structures/commands/Request.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "video",
      memberName: "video",
      guildOnly: false,
      description: "Search for a Video",
      group: "search",
      usage: "<prefix>video <search>",
      aliases: ["vid"],
      roles: ["Community Member"]
    });
  }

  getEndpoint() {
    return '/videos';
  }
}
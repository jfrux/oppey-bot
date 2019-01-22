const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "guide",
      memberName: 'guide',
      guildOnly: false,
      description: "Search for a Guide",
      group:  "database",
      usage: "<prefix>guide <search>",
      aliases: ["g"],
      roles: ["Community Member"]
    });
  }

  getEndpoint() {
    return '/guides';
  }
}
const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "release",
      memberName: 'release',
      guildOnly: false,
      description: "Search for an openpilot release by feature key words or version number.",
      group:  "database",
      usage: "<prefix>release <search>",
      aliases: ["r","feature"],
      roles: ["Community Member"]
    });
  }
  
  getEndpoint() {
    return '/release_features';
  }

}
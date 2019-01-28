const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "vehicle",
      memberName: "vehicle",
      guildOnly: false,
      description: "Search for a Vehicle",
      group: "search",
      usage: "<prefix>vehicle <search>",
      aliases: ["v","veh"],
      roles: ["Community Member"]
    });
  }

}
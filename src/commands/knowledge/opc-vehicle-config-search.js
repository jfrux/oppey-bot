const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "vehicle",
      memberName: "vehicle",
      guildOnly: false,
      hidden: true,
      description: "Search for a Vehicle",
      group: "knowledge",
      usage: "<prefix>vehicle <search>",
      aliases: ["v","veh"],
      roles: ["Community Member"]
    });
  }

}
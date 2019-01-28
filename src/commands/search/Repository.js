const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "repo",
      memberName: 'repo',
      guildOnly: false,
      description: "Search for a fork of Openpilot",
      group: "search",
      usage: "<prefix>repo <search>",
      aliases: ["repo","fork"],
      roles: ["Community Member"]
    });
  }
  getEndpoint() {
    return "/repositories";
  }
  getLabel() {
    return "Openpilot Repository";
  }
}
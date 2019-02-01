const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "pr",
      memberName: 'pr',
      guildOnly: false,
      description: "Search for a Pull Request",
      group: "knowledge",
      hidden: true,
      usage: "<prefix>pr <search>",
      aliases: ["pull_request"],
      roles: ["Community Member"]
    });
  }
  getEndpoint() {
    return "/pull_requests";
  }
  getLabel() {
    return "Pull Request";
  }
}
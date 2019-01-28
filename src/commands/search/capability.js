const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "capability",
      memberName: 'capability',
      guildOnly: false,
      description: "Search for a Vehicle Capability (Lane Keep Assist, etc.)",
      group: "search",
      usage: "<prefix>cap <search>",
      aliases: ["cap","term"]
    });
  }
  getEndpoint() {
    return "/vehicle_capabilities";
  }
  getLabel() {
    return "Capability";
  }
}
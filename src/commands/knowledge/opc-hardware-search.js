const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "hardware",
      memberName: 'hardware',
      guildOnly: false,
      hidden: true,
      description: "Search for a Hardware",
      group: "knowledge",
      usage: "<prefix>hw <search>",
      aliases: ["hw"],
      roles: ["Community Member"]
    });
  }
  getEndpoint() {
    return "/hardware_items";
  }
  getLabel() {
    return "Hardware";
  }
}
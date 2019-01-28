const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "faq",
      memberName: 'faq',
      guildOnly: false,
      description: "Search for a FAQ",
      group: "search",
      usage: "<prefix>faq <search>",
      aliases: ["f"],
      roles: ["Community Member"]
    });
  }

  getEndpoint() {
    return '/faqs';
  }

}
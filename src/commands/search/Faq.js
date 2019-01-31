const Command = require("../../structures/commands/Request.js");
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: "faq",
      hidden: true,
      memberName: 'faq',
      guildOnly: false,
      description: "Search for a FAQ",
      group: "knowledge",
      usage: "<prefix>faq <search>",
      aliases: ["f"],
      roles: ["Community Member"]
    });
  }

  getEndpoint() {
    return '/faqs';
  }

}
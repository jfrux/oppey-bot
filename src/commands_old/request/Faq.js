const Request = require("../Request.js");
const { version } = require("discord.js");
const fetch = require('node-fetch');

class FaqRequest extends Request {
  constructor (client) {
    super(client, {
      name: "faq",
      endpoint: "/faqs.json",
      description: "Search for a FAQ",
      category: "Knowledge Base",
      usage: "faq <search>",
      aliases: ["f"],
      guildOnly: true,
      permLevel: "User"
    });
  }

  getEndpoint() {
    return '/faqs';
  }

}

module.exports = FaqRequest;

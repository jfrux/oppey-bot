const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "faq",
      desc: "Search for a FAQ",
      group:  "database",
      usage: "<prefix>faq <search>",
      aliases: ["f"],
      roles: ["Community Member"]
    });
  }

  getEndpoint() {
    return '/faqs';
  }

}
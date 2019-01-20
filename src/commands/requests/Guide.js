const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "guide",
      desc: "Search for a Guide",
      group:  "Knowledge Base",
      usage: "<prefix>guide <search>",
      aliases: ["g"],
      roles: ["Community Member"]
    });
  }

  getEndpoint() {
    return '/guides';
  }
}
const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "video",
      desc: "Search for a Video",
      group: "database",
      usage: "<prefix>video <search>",
      aliases: ["vid"],
      roles: ["Community Member"]
    });
  }

  getEndpoint() {
    return '/videos';
  }
}
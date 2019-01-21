const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "hw",
      desc: "Search for a Hardware",
      group:  "database",
      usage: "<prefix>hw <search>",
      aliases: ["hardware"],
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
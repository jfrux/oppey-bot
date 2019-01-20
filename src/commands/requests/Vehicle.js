const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "vehicle",
      desc: "Search for a Vehicle",
      group:  "Knowledge Base",
      usage: "<prefix>vehicle <search>",
      aliases: ["v","veh"],
      roles: ["Community Member"]
    });
  }

}
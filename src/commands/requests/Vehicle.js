const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "vehicle",
      desc: "Search for a Vehicle",
      group:  "database",
      usage: "<prefix>vehicle <search>",
      aliases: ["v","veh"],
      roles: ["Community Member"]
    });
  }

}
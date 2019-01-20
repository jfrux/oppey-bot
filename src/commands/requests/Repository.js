const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "repo",
      desc: "Search for a fork of Openpilot",
      group:  "Knowledge Base",
      usage: "<prefix>repo <search>",
      aliases: ["repo","fork"],
      roles: ["Community Member"]
    });
  }
  getEndpoint() {
    return "/repositories";
  }
  getLabel() {
    return "Openpilot Repository";
  }
}
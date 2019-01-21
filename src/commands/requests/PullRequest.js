const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "pr",
      desc: "Search for a Pull Request",
      group:  "database",
      usage: "<prefix>pr <search>",
      aliases: ["pull_request"],
      roles: ["Community Member"]
    });
  }
  getEndpoint() {
    return "/pull_requests";
  }
  getLabel() {
    return "Pull Request";
  }
}
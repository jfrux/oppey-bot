const Request = require("../Request.js");
const { version } = require("discord.js");
const fetch = require('node-fetch');

module.exports = class extends Request {
  constructor () {
    super({
      name: "cap",
      desc: "Search for a Vehicle Capability",
      group: "Knowledge Base",
      usage: "<prefix>cap <search>",
      roles: ["Community Member"],
      aliases: ["cap","term", "feat"]
    });
  }
  getEndpoint() {
    return "/vehicle_capabilities";
  }
  getLabel() {
    return "Capability";
  }
}
const Request = require("../../Request.js");
module.exports = class extends Request {
  constructor () {
    super({
      name: "capability",
      desc: "Search for a Vehicle Capability",
      group: "database",
      usage: "<prefix>cap <search>",
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
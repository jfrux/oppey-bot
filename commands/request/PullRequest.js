const Request = require("../Request.js");
const { version } = require("discord.js");
const fetch = require('node-fetch');

class CapabilityRequest extends Request {
  constructor (client) {
    super(client, {
      name: "pr",
      description: "Search for a Pull Request",
      category: "Knowledge Base",
      usage: "pr <search>",
      aliases: ["pull_request"],
      guildOnly: true,
      permLevel: "User"
    });
  }
  getEndpoint() {
    return "/pull_requests";
  }
  getLabel() {
    return "Pull Request";
  }
  // /**
  //  * Override this to format the response.
  //  * @param {*} json 
  //  */
  // normalizeResponse(json) {
  //   const firstResponse = json[0];
  //   let publicUrl = `${this.getBaseURL()}${this.getEndpoint()}/${firstResponse.slug}`
  //   let lines = [];
  //   let titleAndUrlLength = firstResponse.title.length+4+publicUrl.length;
  //   lines.push(`**${firstResponse.title}**`);
  //   // lines.push(`${firstResponse.exerpt}`.substring(0,2000-titleAndUrlLength));
  //   lines.push(publicUrl);
  //   let response = lines.join('\n');
  //   console.log("response:",response);
  //   return response
  // }

}

module.exports = CapabilityRequest;

const Request = require("../Request.js");
const { version } = require("discord.js");
const fetch = require('node-fetch');

class GuideRequest extends Request {
  constructor (client) {
    super(client, {
      name: "guide",
      endpoint: "/guides.json",
      description: "Search for a Guide",
      category: "Knowledge Base",
      usage: "guide <search>",
      aliases: ["g"],
      guildOnly: true,
      permLevel: "User"
    });
  }

  getEndpoint() {
    return '/guides';
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

module.exports = GuideRequest;

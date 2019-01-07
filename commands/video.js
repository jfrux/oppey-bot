const Request = require("../base/Request.js");
const { version } = require("discord.js");
const fetch = require('node-fetch');

class VideoRequest extends Request {
  constructor (client) {
    super(client, {
      name: "video",
      endpoint: "/videos.json",
      description: "Search for a Video",
      category: "System",
      usage: "video <search>",
      aliases: ["vid"],
      guildOnly: true,
      permLevel: "User"
    });
  }

  getEndpoint() {
    return '/videos';
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

module.exports = VideoRequest;

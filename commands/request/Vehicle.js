const Request = require("../Request.js");
const { version } = require("discord.js");
const fetch = require('node-fetch');

class VehicleRequest extends Request {
  constructor (client) {
    super(client, {
      name: "vehicle",
      endpoint: "/vehicles.json",
      description: "Search for a Vehicle",
      category: "Knowledge Base",
      usage: "vehicle <search>",
      aliases: ["v","veh"],
      guildOnly: true,
      permLevel: "User"
    });
  }

  getEndpoint() {
    return '/vehicles';
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

module.exports = VehicleRequest;

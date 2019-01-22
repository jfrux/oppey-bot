const Request = require("../structures/commands/Request.js");
const SEARCH_TYPES = require("../constants/search_types");
module.exports = class extends Request {
  constructor (options) {
    super({
      name: "search",
      description: "Search data from opc.ai",
      group: "database",
      usage: "<prefix>search <type> <search>",
      aliases: ["s"]
    });
  }
  checkForSearchType(str) {

  }
  action(message, [...args]) {
    let requestUrl = `${this.getBaseURL()}${this.getEndpoint()}.json?q=${value.join(" ")}`;
    const label = this.getLabel();
    if (value.length) {
      // console.log("Sending request to opc.ai:\n",requestUrl);
      fetch(requestUrl)
        .then(res => res.json())
        .then((json) => {
          let responses = this._handleResponse(json, value.join(" "));
          if (responses) {
            message.reply(`here is the top **${label}** result for **${value.join(" ")}**...\n`);
          } else {
            message.reply(`I could not find a **${label}** for search term **${value.join(" ")}**...`);
            return;
          }
          responses.forEach((resp, index) => {
            message.channel.send(resp);
          });
        });
    } else {
      message.reply(`You must specify a search query to find a **${label}**...`);
    }
    message.delete(500);
  }
}
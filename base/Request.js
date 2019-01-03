const Command = require("./Command.js");
const { version } = require("discord.js");
const fetch = require('node-fetch');

class Request extends Command {
  getBaseURL() {
    if (process.env.NODE_ENV !== 'production') {
      return "http://localhost:3000";
    } else {
      return "https://opc.ai";
    }
  }

  /**
   * Override this to set the endpoint;
   */
  getEndpoint() {
    return '';
  }

  
  /**
   * Override this to format the response.
   * @param {*} json 
   */
  normalizeResponse(json, query) {
    const firstResponse = json[0];
    if (firstResponse) {
      let publicUrl = `${this.getBaseURL()}${this.getEndpoint()}/${firstResponse.slug}`
      let lines = [];
      let titleAndUrlLength = firstResponse.title.length+4+publicUrl.length;
      lines.push(`**${firstResponse.title}**`);
      if (firstResponse.body) {
        lines.push(`${firstResponse.body}`.substring(0,2000-titleAndUrlLength));
      }
      lines.push(publicUrl);
      let response = lines.join('\n');
      // console.log("response:",response);
      return response
    } else {
      return `I'm sorry, I could not find a **${this.name}** for search term ***${query}***...`;
    }
    
  }

  _handleResponse(json, query) {
    console.log("Handling response:");
    return this.normalizeResponse(json, query);
  }

  async run (message, [...value], level) { // eslint-disable-line no-unused-vars
    let requestUrl = `${this.getBaseURL()}${this.getEndpoint()}.json?q=${value.join(" ")}`;
    
    console.log("Sending request to opc.ai:\n",requestUrl);
    fetch(requestUrl)
      .then(res => res.json())
      .then(json => message.channel.send(this._handleResponse(json, value.join(" "))));
  }
}

module.exports = Request;

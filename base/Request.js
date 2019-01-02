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
  normalizeResponse(json) {
    return `Response has not been normalized yet.`;
  }

  _handleResponse(json) {
    console.log("Handling response:");
    return this.normalizeResponse(json);
  }

  async run (message, [...value], level) { // eslint-disable-line no-unused-vars
    let requestUrl = `${this.getBaseURL()}${this.getEndpoint()}.json?q=${value.join(" ")}`;
    
    console.log("Sending request to opc.ai:\n",requestUrl);
    fetch(requestUrl)
      .then(res => res.json())
      .then(json => message.channel.send(this._handleResponse(json)));
  }
}

module.exports = Request;

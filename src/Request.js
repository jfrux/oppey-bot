const inflection = require("inflection");
const { Command } = require('@yamdbf/core');
const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
module.exports = class extends Command
{
	constructor(options) {
		super(options);
  }
  getLabel() {
    return inflection.titleize(this.name);
  }

  getBaseURL() {
    return process.env.OPC_BASE_URL || "https://opc.ai";
  }

  /**
   * Override this to set the endpoint;
   */
  getEndpoint() {
    return '/' + inflection.pluralize(this.name);
  }

  embedResponse(resp) {
    const publicUrl = resp.url || `${this.getBaseURL()}${this.getEndpoint()}/${resp.slug || resp.id}`
    
    const embed = new MessageEmbed();
    
    /*
    * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
    */
    embed.setColor(0x00AE86);
  
    // embed.color = 3447003;
    if (resp.author) {
      embed.setAuthor(resp.author.name, resp.author.image);
    }
    if (resp.image) {
      // embed.setImage(`${resp.image}`);
      embed.setThumbnail(`${resp.image}`);
    }
    if (resp.title) {
      embed.setTitle(resp.title);
    }
    if (publicUrl) {
      embed.setURL(publicUrl);
    }
    if (resp.body) {
      embed.setDescription(resp.body);
    }
    if (resp.fields) {
      resp.fields.forEach((field) => {
        embed.addField(field.name, field.value, true);
      });
    }

    return {
      embed: embed
    };
  }

  individualResponse(resp) {
    let publicUrl = `${this.getBaseURL()}${this.getEndpoint()}/${resp.slug || resp.id}`
    let lines = [];
    let titleAndUrlLength = resp.title.length+4+publicUrl.length;
    lines.push(`**${resp.title}**`);
    if (resp.body) {
      lines.push(`\`\`\`${resp.body}\`\`\``.substring(0,2000-titleAndUrlLength));
    }
    lines.push(publicUrl);
    let response = lines.join('\n');

    return response;
  }

  /**
   * Override this to format the response.
   * @param {*} json 
   */
  normalizeResponse(json, query) {
    let currIndex = 0;
    let maxIndex = 1;
    let responses = [];
    let displayingCount = json.length > maxIndex ? maxIndex : json.length;
    if (json.length) {
      json.forEach((resp, index) => {
        if (index < maxIndex) {
          responses.push(this.embedResponse(resp));
          currIndex++;
        }
      });
    }

    if (responses.length) {
      return responses;
    }
  }

  _handleResponse(json, query) {
    // console.log("Handling response:", json);
    return this.normalizeResponse(json, query);
  }
  action(message, [...value]) {
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
  }
}
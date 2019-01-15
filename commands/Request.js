const Command = require("../commands/Command.js");
const { version, MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
const inflection = require("inflection");
class Request extends Command {
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
    embed.setColor(0x00AE86)
    // embed.setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
    // embed.setImage("http://i.imgur.com/yVpymuV.png")
    // embed.setThumbnail("http://i.imgur.com/p2qNFag.png")
  //   /*
  //   * Takes a Date object, defaults to current date.
  //   */
  //   embed.setTimestamp()
  //   embed.setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  //   embed.addField("This is a field title, it can hold 256 characters",
  //     "This is a field value, it can hold 1024 characters.")
  //   /*
  //   * Inline fields may not display as inline if the thumbnail and/or image is too big.
  //   */
  //  embed.addField("Inline Field", "They can also be inline.", true)
  //   /*
  //   * Blank field, useful to create some space.
  //   */
  //  embed.addBlankField(true)
  //  embed.addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
  
  
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

  async run (message, [...value], level) { // eslint-disable-line no-unused-vars
    let requestUrl = `${this.getBaseURL()}${this.getEndpoint()}.json?q=${value.join(" ")}`;
    const label = this.getLabel();
    console.log("Sending request to opc.ai:\n",requestUrl);
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
  }
}

module.exports = Request;

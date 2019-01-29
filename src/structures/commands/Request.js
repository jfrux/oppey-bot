require('dotenv').config();
const { DMChannel } = require("discord.js");
const inflection = require("inflection");
// const { Command } = require('@yamdbf/core');
const Command = require("../Command");
const moment = require("moment");
const RC = require('reaction-core');
const fetch = require('node-fetch');
const DATE_FORMAT = "MM/DD/YYYY hh:mmA";
const emojis = [
  //"\u0030\u20E3",//zero
  "\u0031\u20E3", //:one:
  "\u0032\u20E3", //:two:
  "\u0033\u20E3", //:three:
  "\u0034\u20E3", //:four:
  "\u0035\u20E3", //:five:
  // "\u0036\u20E3",
  // "\u0037\u20E3",
  // "\u0038\u20E3",
  // "\u0039\u20E3"
];
module.exports = class extends Command {
  constructor(client, info) {
    super(client, info);

    this.args = [
      {
        key: 'query',
        prompt: 'You must enter a search query...'
      }
    ]
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

  buildEmbed(resp) {
    const publicUrl = resp.url || `${this.getBaseURL()}${this.getEndpoint()}/${resp.slug || resp.id}`
    
    const embed = {};
    embed.color = 0x00AE86;
   
    /*
    * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
    */
    // embed.setColor(0x00AE86);
  
    // embed.color = 3447003;
    if (resp.author) {
      embed.author = {
        name: resp.author.name,
        iconURL: resp.author.image
      }
    }
    if (resp.image) {
      embed.thumbnail = {
        url: resp.image
      }
      // embed.setImage(`${resp.image}`);
    }

    if (resp.attachment_url) {
      let attachment = resp.attachment_url;
      if (attachment.endsWith(".png") || attachment.endsWith(".jpg") || attachment.endsWith(".webp")) {
        embed.thumbnail = {
          url: attachment
        }
      }
    }
    if (resp.title) {
      embed.title = resp.title;
    }
    if (publicUrl) {
      embed.url = publicUrl;
    }
    
    if (resp.body) {
      embed.description = resp.body;
    }
    if (!resp.title && resp.url) {
      embed.description = `${embed.description}\n\n[Go to message...](${resp.url})`;
    }
    if (resp.fields) {
      embed.fields = [];
      resp.fields.forEach((field) => {
        embed.fields.push({
          name: field.name,
          value: field.value,
          inline: true
        })
      });
    }
    let footer = [];
    let createdAt,updatedAt;
    if (resp.created_at) {
      createdAt = moment(resp.created_at);
      footer.push(`Posted ${createdAt.format(DATE_FORMAT)}`)
    }

    if (resp.updated_at) {
      createdAt = moment(resp.created_at);
      updatedAt = moment(resp.updated_at);
      if (createdAt.diff(updatedAt, 'minutes') > 0) {
        footer.push(`Edited ${createdAt.format(DATE_FORMAT)}`)
      }
    }

    
    if (footer.length) {
      embed.footer = {
        text: footer.join(" - ")
      }
    }
    return embed;
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
    let maxIndex = emojis.length-1;
    let responses = [];
    let displayingCount = json.length > maxIndex ? maxIndex : json.length;
    if (json.length) {
      json.forEach((resp, index) => {
        if (index <= maxIndex) {
          responses.push(this.buildEmbed(resp));
          currIndex++;
        }
      });
    }

    if (responses.length) {
      return responses;
    }
  }
  _buildButtons(responses) {
    let responseButtons = [];
    responses.forEach((response,index) => {
      responseButtons.push({ 
        emoji: emojis[index],
        run: (user, message) => {
          message.edit({ embed: response })
        }
      })
    })
    return responseButtons;
  }
  _handleResponse(json, query) {
    // console.log("Handling response:", json);
    return this.normalizeResponse(json, query);
  }
  async run(message, value) {
    const isDM = message.channel instanceof DMChannel;
    let requestUrl = `${this.getBaseURL()}${this.getEndpoint()}.json?q=${value}`;
    const label = this.getLabel();
    if (value.length) {
      console.log("Sending request to opc.ai:\n",requestUrl);
      const resp = await fetch(requestUrl);
      const json = await resp.json();
      let responses = this._handleResponse(json, value);
      
      
      if (!responses) {
        message.reply(`I could not find a **${label}** for search term **${value}**...`);
        return;
      }
      let buttons = this._buildButtons(responses);
      
      // responses.forEach((resp, index) => {
      //   message.channel.send(resp);
      // });f
      const newMenu = new RC.Menu(responses[0], buttons, {
        owner: message.author.id
      });
      this.client.menuHandler.addMenus(newMenu);
      let menuMessage;
      if (isDM) {
        responses.forEach((response) => {
          message.author.send({
            embed: response
          });
        })
      } else {
        message.reply(`here are the top results for your search.`);
        menuMessage = await message.channel.sendMenu(newMenu);
      }
      // const menuFilter = (reaction, user) => {
      //   console.dir(reaction.emoji.name)
      //   console.dir(emojis);
      //   console.log("emojis.includes(reaction.emoji.name)", emojis.includes(reaction.emoji.name));
      //   console.log("user.id === message.author.id", user.id === message.author.id);
      //   return user.id === message.author.id && emojis.includes(reaction.emoji.toString());
      // }
      // emojis.forEach((emoji) => {
      //   menuMessage.react(emoji)
      // });
      // const collected = await menuMessage.awaitReactions(menuFilter, { time: 30000 })
    
      // console.log("Collected response!", collected);
      // const chosen = reaction.emoji.name;
      // buttons.forEach((button) => {
      //   console.log("buttonChoice:",button);
      //   if (chosen === button.emoji) {
      //     console.log("Chosen!");
      //     button.run(message)
      //   }
      // })
        // collector.stop();
      // });
    } else {
      message.reply(`You must specify a search query to find a **${label}**...`);
    }
    // message.delete(500);
  }
}
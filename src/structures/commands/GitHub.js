
const { DMChannel, MessageAttachment } = require("discord.js");
const { GITHUB_TOKEN } = process.env;
const Octokit = require('@octokit/rest');
const inflection = require("inflection");
// const { Command } = require('@yamdbf/core');
const Command = require("../Command");
const moment = require("moment");
const RC = require('reaction-core');
const fetch = require('node-fetch');
const DATE_FORMAT = "MM/DD/YYYY hh:mmA";
const crypto = require('crypto');
const YAML = require('json-to-pretty-yaml');
const ROUTES = require("@octokit/rest/plugins/rest-api-endpoints/routes.json");
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
function removeEmptyKeysFromObject(obj) {
  Object.keys(obj).forEach(key => {
 if (Object.prototype.toString.call(obj[key]) === '[object Date]' && (obj[key].toString().length === 0 || obj[key].toString() === 'Invalid Date')) {
   delete obj[key];
 } else if (obj[key] && typeof obj[key] === 'object') {
   this.removeEmptyKeysFromObject(obj[key]);
 } else if (obj[key] == null || obj[key] === '') {
   delete obj[key];
 }

 if (obj[key]
   && typeof obj[key] === 'object'
   && Object.keys(obj[key]).length === 0
   && Object.prototype.toString.call(obj[key]) !== '[object Date]') {
   delete obj[key];
 }
});
 return obj;
}
const api = new Octokit({
  auth: `token ${GITHUB_TOKEN}`
});
module.exports = class extends Command {
  constructor(client, info) {
    const ghPrefix = "gh";
    const ghGroup = info.githubGroup;
    const ghGroupSingular = inflection.singularize(ghGroup);
    const ghMethod = info.githubMethod;
    const ghCommand = inflection.dasherize(inflection.underscore(ghMethod));
    const ghCommandParts = ghCommand.split('-');
    const ghCommandActionName = ghCommandParts[0];
    const ghCommandItemName = ghCommandParts.slice(1,ghCommandParts.length).join(" ");
    const commandName = `${ghPrefix}-${ghCommand}`;
    const apiGroup = api[ghGroup];
    const apiMethod = apiGroup[ghMethod];
    const apiRouteInfo = ROUTES[ghGroup][ghMethod];
    const apiHttpMethod = apiRouteInfo['method'];
    const apiParams = ROUTES[ghGroup][ghMethod]['params'];
    const paramKeys = Object.keys(apiParams);
    const commandDescription = `${inflection.pluralize(inflection.capitalize(ghCommandActionName))} a ${ghGroup} ${ghCommandItemName}.`;
    
    let requiredArgs = [];
    let args = [];
    paramKeys.forEach((key) => {
      const param = apiParams[key];
      let paramLabel;

      if (ghGroupSingular === key) {
        paramLabel = `name of the ${key}`;
      } else {
        if (param.required) {
          paramLabel = `${ghGroupSingular}'s ${key}`;
        } else {
          paramLabel = `${inflection.singularize(ghCommandItemName)} ${key}`
        }
      }
      let prompt = `Enter the ${paramLabel}?`;
      if (param.required) {
        requiredArgs.push({
          key,
          prompt,
          type: param.type
        });
      } else {
        let prompt = `Enter the ${paramLabel}?`;
        args.push({
          key,
          prompt,
          type: param.type,
          default: (function() {
            if (param.type === "string") {
              return "";
            } else if (param.type === "integer") {
              if (key === "page") {
                return 1;
              }
              if (key === "per_page") {
                return 10;
              }
            }
          })()
        })
      }
    });
    super(client, {
      ...info,
      group: 'github',
      name: commandName,
      memberName: commandName,
      description: commandDescription,
      args: [
        ...requiredArgs,
        ...args
      ]
    });
    this.useEmbed = info.useEmbed || false;
    this.ghPrefix = ghPrefix;
    this.ghGroup = ghGroup;
    this.ghGroupSingular = ghGroupSingular;
    this.ghMethod = ghMethod;
    this.ghCommand = ghCommand;
    this.ghCommandParts = ghCommandParts;
    this.ghCommandActionName = ghCommandActionName;
    this.ghCommandItemName = ghCommandItemName;
    this.commandName = commandName;
    this.apiGroup = apiGroup;
    this.apiMethod = apiMethod;
    this.apiRouteInfo = apiRouteInfo;
    this.apiHttpMethod = apiHttpMethod;
    this.apiParams = apiParams;
    this.paramKeys = paramKeys;
    this.commandDescription = commandDescription;
  }

  /**
   * Ran by CommandoClient and generally doesn't need overridden.
   * @param {Object} message 
   * @param {Array} args
   */
  async run(message, args) {
    const isDM = message.channel instanceof DMChannel;
    const label = `${this.ghCommandActionName} ${this.ghCommandItemName}`
    args = removeEmptyKeysFromObject(args);
    console.log(`[GitHub] ${this.ghCommand}`);
    console.dir(args);
    const resp = await this.apiMethod(args);
    const data = resp.data;
    console.log(`[GitHub] ${this.ghCommand} completed.`);
    const responses = this._normalizeResponse(data);
    
    if (!responses) {
      message.reply(`No GitHub for those **${label}** parameters...`);
      return;
    }
    
    if (!this.isDM && this.useEmbed) {
      let buttons = this._buildButtons(responses);
      console.log("RESPONSE:",responses[0]);
      const newMenu = new RC.Menu(responses[0].embed, buttons, {
        owner: message.author.id
      });

      this.client.menuHandler.addMenus(newMenu);
      let menuMessage;

      menuMessage = await message.channel.sendMenu(newMenu);
    } else {
      responses = responses.map((response, index) => {
        let responseDigest, responseBuffer;
        const hash = crypto.createHash('sha256');
        hash.update(response);
        responseDigest = hash.digest('hex');
        const fullResponse = "```yaml\n" + response + "\n```";
        if (fullResponse.length > 2000){
          responseBuffer = new Buffer.from(response);
          response = new MessageAttachment(responseBuffer, `${this.ghMethod}_${responseDigest}.yaml`);
          message.author.send("", response, { split: true });
        } else {
          message.author.send(fullResponse, { split: true });
        }
      });
    }
  }

  /**
   * getDescription
   * @param {*} json 
   */
  _getEmbedDescription(json) {
    return null;
  }

  _getEmbedTitle(json) {
    return null;
  }

  _getEmbedAuthor(json) {
    // {
    //   name: resp.author.name,
    //   iconURL: resp.author.image
    // }
    return null;
  }

  _getEmbedImage(json) {
    // {
    //   url: json.image
    // }
    return null;
  }

  _getEmbedThumbnail(json) {
    // {
    //   url: json.image
    // }
    return null;
  }

  _getEmbedUrl(json) {
    // {
    //   url: json.url
    // }
    return null;
  }

  _getEmbedFields(json) {
    // fields = [];
    //   fields.push({
    //     name: field.name,
    //     value: field.value,
    //     inline: true
    //   })
    return null;
  }

  _getEmbedColor(json) {
    // 0x00AE86;
    return 0x00AE86;
  }

  _getEmbedFooter(json) {
    // Some message for the footer;
    return null;
  }
  
  /**
   * Override this to format an individual record.
   * @param {*} json 
   */
  _normalizeItem(json) {
    if (this.useEmbed) {
      return { embed: this._buildEmbed(json) }
    } else {
      return YAML.stringify(json);
    }
  }

  /**
   * Override this to format the response.
   * @param {*} json 
   */
  _normalizeResponse(json) {
    let maxIndex = emojis.length-1;
    let responses = [];
    let displayingCount = json.length > maxIndex ? maxIndex : json.length;
    if (Array.isArray(json)) {
      if (json.length) {
        json.forEach((resp, index) => {
          if (index <= maxIndex) {
            responses.push(this._normalizeItem(resp));
          }
        });
      }
    } else if (typeof json === 'object') {
      responses.push(this._normalizeItem(resp));
    }

    if (responses.length) {
      return responses;
    }
  }

  /**
   * Override this to format the embed.
   * @param {*} resp 
   */
  _buildEmbed(resp) {
    const embed = {};
    const title = this._getEmbedTitle(resp);
    const author = this._getEmbedAuthor(resp);
    const image = this._getEmbedImage(resp);
    const thumbnail = this._getEmbedThumbnail(resp);
    const description = this._getEmbedDescription(resp);
    const url = this._getEmbedUrl(resp);
    const fields = this._getEmbedFields(resp);
    const color = this._getEmbedColor(resp);
    const footer = this._getEmbedFooter(resp);
   
    if (title) embed.title = title;
    if (author) embed.author = author;
    if (image) embed.image = image;
    if (thumbnail) embed.thumbnail = thumbnail;
    if (description) embed.description = description;
    if (url) embed.url = url;
    if (color) embed.color = color;
    if (fields) embed.fields = fields;
    if (footer) embed.footer = footer;
    
    // let createdAt,updatedAt;
    // if (resp.created_at) {
    //   createdAt = moment(resp.created_at);
    //   footer.push(`Posted ${createdAt.format(DATE_FORMAT)}`)
    // }

    // if (resp.updated_at) {
    //   createdAt = moment(resp.created_at);
    //   updatedAt = moment(resp.updated_at);
    //   if (createdAt.diff(updatedAt, 'minutes') > 0) {
    //     footer.push(`Edited ${createdAt.format(DATE_FORMAT)}`)
    //   }
    // }

    
    // if (footer.length) {
    //   embed.footer = {
    //     text: footer.join(" - ")
    //   }
    // }
    return embed;
  }

  _buildButtons(responses) {
    let responseButtons = [];
    responses.forEach((response,index) => {
      responseButtons.push({ 
        emoji: emojis[index],
        run: (user, message) => {
          message.edit(response)
        }
      })
    })
    return responseButtons;
  }
  
}
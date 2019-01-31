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
    const profilePrefix = "profile";
    const profileGroup = info.group;
    const profileGroupSingular = inflection.singularize(profileGroup);
    // const profileMethod = info.githubMethod;
    
    const commandName = `${profilePrefix}-${info.name}`;
    const commandDescription = info.description;
    super(client, {
      ...info,
      group: 'me',
      name: commandName,
      memberName: commandName,
      description: commandDescription,
      args: info.args
    });
    this.useEmbed = info.useEmbed || false;
    this.profilePrefix;
    this.profileGroup;
    this.profileGroupSingular;
    this.commandName = commandName;
    this.commandDescription = commandDescription;
  }
}
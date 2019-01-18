// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS


// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
const Command = require("../Command.js");
var beautify = require('js-beautify').js_beautify;
var inspect = require('util').inspect;
const Discord = require('discord.js');
if (!('toJSON' in Error.prototype)){
	Object.defineProperty(Error.prototype, 'toJSON', {
		value: function () {
			var alt = {};

			Object.getOwnPropertyNames(this).forEach(function (key) {
				alt[key] = this[key];
			}, this);

			return alt;
		},
		configurable: true,
		writable: true
	});
}
class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category:"System",
      usage: "eval <expression>",
      aliases: ["ev"],
      permLevel: "Bot Owner"
    });
  }

  async run (message, args, level) { // eslint-disable-line no-unused-vars
    	var whatrun = message.content.replace(/^(.*?) /,"").trim(); //replaces first word(aka -ev or -eval) with nothing
		var outcome = '';
		try{
			outcome = await eval(whatrun);
		}catch (err){
			outcome = err.message;
		}
		if(typeof outcome != "string") outcome = inspect(outcome, { depth: 1 }); // JSON.stringify(outcome, null, 2);
		if(("Command: ```" + beautify(whatrun) + "```\nOutput: ```" + outcome + "```").length > 2000){
			if(("Command: ```" + beautify(whatrun) + "```").length < 2000){
				message.reply("Command: ```" + beautify(whatrun) + "```");
			}else{
				var whatrunbuf = new Buffer.from(beautify(whatrun));
				var whatrunatt = new Discord.MessageAttachment(whatrunbuf, "whatrun.txt");
				message.reply("Command too long to print in a discord message...", whatrunatt);
			}
			if(("Output: ```" + outcome + "```").length < 2000){
				message.reply("Output: ```" + outcome + "```");
			}else{
				var outcomebuf = new Buffer.from(outcome);
				var outcomeatt = new Discord.MessageAttachment(outcomebuf, "outcome.txt");
				message.reply("Output too long to print in a discord message...", outcomeatt);
			}
		}else{
			message.reply("Command: ```" + beautify(whatrun) + "```\nOutput: ```" + outcome + "```").catch(function(err){});
		}
		message.delete().catch(function(err){});
  }
}

module.exports = Eval;

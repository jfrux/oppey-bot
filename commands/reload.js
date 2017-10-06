const Command = require("../base/Command.js");

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: "reload",
      description: "Reloads a command that has been modified.",
      category: "System",
      usage: "reload [command]",
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!args || args.size < 1) return message.reply("Must provide a command to reload. Derp.");

    let command;
    if (this.client.commands.has(args[0])) {
      command = this.client.commands.get(args[0]);
    } else if (this.client.aliases.has(args[0])) {
      command = this.client.commands.get(this.client.aliases.get(args[0]));
    }
    if (!command) return message.reply(`The command \`${args[0]}\` doesn"t seem to exist, nor is it an alias. Try again!`);

    if (command.shutdown) {
      await command.shutdown(this.client);
    }

    const commandName = command.help.name;

    delete require.cache[require.resolve(`./${commandName}.js`)];
    const cmd = new (require(`./${commandName}`))(this.client);
    this.client.commands.delete(cmd.help.name);
    this.client.aliases.forEach((cmdName, alias) => {
      if (cmdName === command) this.client.aliases.delete(alias);
    });
    
    this.client.commands.set(cmd.help.name, cmd);
    if (cmd.init) {
      cmd.init(this.client);
    }

    cmd.conf.aliases.forEach(alias => {
      this.client.aliases.set(alias, cmd.help.name);
    });

    message.reply(`The command \`${cmd.help.name}\` has been reloaded`);
  }
}
module.exports = Reload;

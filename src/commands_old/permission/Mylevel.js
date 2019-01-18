const Command = require("../Permission.js");

class MyLevel extends Command {
  constructor (client) {
    super(client, {
      name: "mylevel",
      category: "Permissions",
      description: "Displays your permission level for your location.",
      usage: "mylevel",
      guildOnly: true
    });
  }

  async run (message, args, level) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    message.reply(`Your permission level is: ${level} - ${friendly}`);
  }
}

module.exports = MyLevel;

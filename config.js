const config = {
  // Bot Owner, level 10 by default. You no longer need to supply the owner ID, as the bot
  // will pull this information directly from it's application page.

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
  "token":  process.env.DISCORD_KEY,

  // Default per-server settings. These settings are entered in a database on first load, 
  // And are then completely ignored from this file. To modify default settings, use the `conf` command.
  // DO NOT REMOVE THIS BEFORE YOUR BOT IS LOADED AND FUNCTIONAL.
  
  defaultSettings: {
    "prefix": process.env.DISCORD_COMMAND_PREFIX || "-",
    "modLogChannel": "moderators",
    "modRole": "Community Moderator",
    "adminRole": "Community Staff",
    "systemNotice": "true",
    "welcomeChannel": "discord-server-admin",
    "welcomeMessage": "{{user}} joined!",
    "welcomeEnabled": "true"
  }
};

module.exports = config;
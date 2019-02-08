const nhtsa = require('nhtsa');
const { DATABASE_URL } = process.env;
const COLOR = require('chalk');
const Store = require('openrecord/store/postgres')
const models = require("../util/models.js");
const path = require("path");
module.exports = async (client) => {
  client.orm = new Store({
    migrations: [
      require('../db/migrations/20190122090701_add_initial_structure.js'),
      require('../db/migrations/20190122090705_add_field_to_discord_users.js'),
      require('../db/migrations/20190122090709_add_last_seen_to_discord_users.js'),
      require('../db/migrations/20190122090710_create_message_archive_for_search.js'),
      require('../db/migrations/20190122090711_add_url_to_message_archive.js'),
      require('../db/migrations/20190122090715_add_discord_user_repos_table.js'),
      require('../db/migrations/20190122090716_add_trained_to_discord_messages.js')
    ],
    connection: DATABASE_URL,
    autoLoad: true
  })
  // console.log("[SequelizeProvider] Loading other models...");
  this.models = models(client);
  // console.log("[SequelizeProvider] Loaded models!");
  await client.orm.ready();

  client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
  
  client.user.setActivity("opc.ai | Try -help", { type: "PLAYING" });
};

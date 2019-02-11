require('dotenv').config();
const nhtsa = require('nhtsa');
const { DATABASE_URL } = process.env;
const COLOR = require('chalk');
const Store = require('openrecord/store/postgres')
const models = require("../util/models.js");
const path = require("path");
module.exports = async (client) => {
  client.orm = new Store({
    inflection: {
      'django_content_types' : 'django_content_type',
      'auth_permissions': 'auth_permission',
      'auth_groups': 'auth_group',
      'django_admin_logs': 'django_admin_log',
      'auth_users': 'auth_user',
      'untitled_tables': 'untitled_table',
      'django_chatterbot_tags': 'django_chatterbot_tag',
      'django_chatterbot_statements': 'django_chatterbot_statement',
      'django_sessions': 'django_session'
    },
    migrations: [
      require('../db/migrations/20190122090701_add_initial_structure.js'),
      require('../db/migrations/20190122090705_add_field_to_discord_users.js'),
      require('../db/migrations/20190122090709_add_last_seen_to_discord_users.js'),
      require('../db/migrations/20190122090710_create_message_archive_for_search.js'),
      require('../db/migrations/20190122090711_add_url_to_message_archive.js'),
      require('../db/migrations/20190122090715_add_discord_user_repos_table.js'),
      require('../db/migrations/20190122090716_add_trained_to_discord_messages.js'),
      require('../db/migrations/20190122090718_create_discord_channels_table.js')
    ],
    connection: DATABASE_URL,
    autoLoad: true
  })

  
  // console.log("[SequelizeProvider] Loading other models...");
  this.models = models(client);
  // console.log("[SequelizeProvider] Loaded models!");
  await client.orm.ready();
  // sync channels
  const DiscordChannel = client.orm.Model('DiscordChannel');
  try {
    client.guilds.first().channels.forEach(async (channel) => {
      const { id, type, guild, deleted, name, rawPosition, parentID, topic, lastMessageID, rateLimitPerUser  } = channel;
      let channelRecord = await DiscordChannel.find(channel.id);

      console.log(`Registering channel... ${channel.name}`)
      let updatedAttributes = {
        id,
        discord_guild_id: guild.id,
        type, 
        deleted, 
        name, 
        raw_position: rawPosition,
        parent_id: parentID || 0,
        topic,
        discord_last_message_id: lastMessageID || 0,
        rate_limit_per_user: rateLimitPerUser
      };
      if (!channelRecord) {
        try {
          await DiscordChannel.create(updatedAttributes);
        } catch (e) {
          console.log("Could not create channel record...", e);
        }
      } else {
        try {
          await channelRecord.update(updatedAttributes);
        } catch (e) {
          console.log("Could not update channel record...", e);
        }
      }
    });
  } catch (e) {
    console.log("[ERROR] Could not sync channels to db...",e);
  }
  client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
  client.user.setActivity("opc.ai | Try -help", { type: "PLAYING" });
};

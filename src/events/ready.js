const nhtsa = require('nhtsa');
const { DATABASE_URL } = process.env;
const COLOR = require('chalk');
const Store = require('openrecord/store/postgres')
const models = require("../util/models.js");
const path = require("path");
module.exports = async client => {
  // try {
  //   const { data } = await nhtsa.getAllMakes();
  //   client.makeList = data;
  // } catch (error) {
  //   console.log("[SequelizeProvider] ERROR FETCHING MAKE LIST!",error);
  // }
  // const migrationsPath = path.join(__dirname, "db/migrations/*");
  // console.log("[SequelizeProvider] Migrations loading from:",migrationsPath);
  client.orm = new Store({
    migrations: [
      require('../db/migrations/20190122090701_add_initial_structure.js'),
      require('../db/migrations/20190122090705_add_field_to_discord_users.js'),
      require('../db/migrations/20190122090709_add_last_seen_to_discord_users.js')
    ],
    connection: DATABASE_URL,
    autoLoad: true
  })
  // console.log("[SequelizeProvider] Loading other models...");
  this.models = models(client);
  // console.log("[SequelizeProvider] Loaded models!");
  await client.orm.ready();
};

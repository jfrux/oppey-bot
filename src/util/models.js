module.exports = (client) => {
  // Models
  const store = client.orm;
  
  store.Model('DiscordUser', function(){
    // this is the `definition scope`
    this.hasMany('discord_user_vehicles', { })
  });

  store.Model('DiscordUserVehicle', function(){
    // this is the `definition scope`
    this.belongsTo('discord_user', {
      model: "DiscordUser"
    })
  });
  
  // Associations
  // Guild.Items = Guild.hasMany(Items, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.ModerationCases = Guild.hasMany(ModerationCase, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Roles = Guild.hasMany(Role, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.ScheduledCommands = Guild.hasMany(ScheduledCommand, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Shop = Guild.hasOne(Shop, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Events = Guild.hasMany(Event, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Streamers = Guild.hasOne(Streamers, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.TextChannels = Guild.hasMany(TextChannel, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Transactions = Guild.hasMany(Transaction, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Triggers = Guild.hasMany(Trigger, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Playlist = Guild.hasMany(Playlist, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.ReactionRolesGroup = Guild.hasMany(ReactionRolesGroup, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  
  // User.Transactions = User.hasMany(Transaction, {
  //   foreignKey: 'userid',
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'CASCADE'
  // });
  // User.Guild = User.belongsToMany(Guild, {
  //   through: 'guildmember',
  //   foreignKey: 'userid',
  //   otherKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });

  // Save (sync) models to database.
  // database.sync({
  //   force: true
  // });
  // User.sync({force: true});
  // Vehicle.sync({force: true});

  // Return models
  // return database.models;
};
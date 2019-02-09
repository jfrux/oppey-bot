module.exports = (client) => {
  // Models
  const store = client.orm;
  
  store.Model('HardwareItem', function(){
    // this is the `definition scope`
  });
  store.Model('HardwareItem', function(){
    // this is the `definition scope`
  });

  store.Model('UserHardwareItem', function(){
    // this is the `definition scope`
    // this.belongsTo('user')
    // this.belongsTo('hardware_item')
  });

  store.Model('User', function(){
    // this is the `definition scope`
    this.hasOne('discord_user', { });
    this.hasMany('user_hardware_items');
    // this.hasMany('hardware_items',{
    //   through: 'user_hardware_items'
    // })
  });

  store.Model('DiscordUser', function(){
    // this is the `definition scope`
    this.hasMany('discord_user_vehicles', { })
    this.hasMany('discord_user_repositories', { })
    this.belongsTo('user');
  });

  store.Model('DiscordUserVehicle', function(){
    // this is the `definition scope`
    this.belongsTo('vehicle_config');
    this.belongsTo('discord_user', {
      model: "DiscordUser"
    })
  });

  store.Model('DiscordUserRepository', function(){
    // this is the `definition scope`
    this.belongsTo('repository', {
      model: 'Repository'
    });
    this.belongsTo('discord_user', {
      model: "DiscordUser"
    })
  });
  store.Model('VehicleConfig', function(){
    this.hasMany('discord_user_vehicles');
  });
  store.Model('Repository', function(){
    this.hasMany('discord_user_repositories');
  });
  store.Model('Guide', function(){

  });

};
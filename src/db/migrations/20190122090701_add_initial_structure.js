module.exports = function (){
  this.createTable('discord_users', {
    id: false
  }, function(){
    this.string('id', {
      not_null: true,
      primary: true
    });
    this.string('avatar');
    this.string('username');
    this.string('info');
    this.string('location');
    this.boolean('afk', {
      not_null: true,
      default: false
    });
    this.string('afkmessage');
    this.boolean('blacklisted');
  });
  this.createTable('discord_user_vehicles', function(){
    this.string('discord_user_id', {
      references: 'discord_users.id'
    });
    this.integer('vehicle_config_id', {
      references: 'vehicle_configs.id'
    });
  
    this.integer('vehicle_year');
    this.string("vehicle_make");
    this.string("vehicle_model");
    this.string("vehicle_trim");
  })
}
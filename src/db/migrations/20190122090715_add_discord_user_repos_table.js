module.exports = function (){
  // try {
  //   this.removeTable('discord_users');
  // } catch (e) {
  //   console.log("[ERR] Could not delete discord_users table.");
  // }
  // try {
  //   this.removeTable('discord_user_vehicles');
  // } catch (e) {
  //   console.log("[ERR] Could not delete discord_user_vehicles table.");
  // }
  
  this.createTable('discord_user_repositories', function(){
    this.string('discord_user_id', {
      references: 'discord_users.id'
    });

    this.integer('repository_id', {
      references: 'repositories.id'
    });
  
    this.string("repository_name");
  });
}
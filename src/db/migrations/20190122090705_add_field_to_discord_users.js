module.exports = function (){
  try {
    this.addColumn('discord_users', function(){
      this.integer('user_id', {
        references: 'users.id'
      })
    })
  } catch (e) {
    console.log("[ERR] Could not add user_id to discord_users.");
  }
}
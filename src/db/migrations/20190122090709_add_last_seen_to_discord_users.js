module.exports = function (){
  try {
    this.addColumn('discord_users', function(){
      this.datetime('last_seen_at');
      this.string('last_seen_in');
      this.integer("total_messages");
    })
  } catch (e) {
    console.log("[ERR] Could not add user_id to discord_users.");
  }
}
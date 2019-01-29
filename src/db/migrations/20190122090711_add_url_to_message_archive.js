module.exports = function (){
  try {
    this.addColumn('discord_messages', function(){
      this.string('jump_url');
    })
  } catch (e) {
    console.log("[ERR] Could not add jump_url to discord_messages.");
  }
}
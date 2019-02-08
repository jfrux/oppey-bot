module.exports = function (){
  try {
    this.addColumn('discord_messages', function(){
      this.boolean('trained',{
        not_null: true,
        default: false
      });
    })
  } catch (e) {
    console.log("[ERR] Could not add trained to discord_messages.");
  }
}
module.exports = function (){
  try {
    this.removeTable('discord_channels');
  } catch (e) {
    console.log("[ERR] Could not delete discord_channels table.");
  }
  this.createTable('discord_channels', {
    id: false
  }, function(){
    this.string('id', {
      not_null: true,
      primary: true
    });
    this.string('parent_id', {
      not_null: true
    });
    this.string('discord_guild_id', {
      not_null: true
    });
    this.string('name');
    this.boolean('deleted');
    this.string('type');
    this.integer('raw_position');
    this.string('discord_last_message_id', {
      not_null: true
    });
    this.string('topic');
    this.integer('rate_limit_per_user');
    this.jsonb('attachment_ids');
    this.timestamp();
  });
}
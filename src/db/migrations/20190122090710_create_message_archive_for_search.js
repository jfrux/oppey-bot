module.exports = function (){
  try {
    this.removeTable('discord_messages');
  } catch (e) {
    console.log("[ERR] Could not delete discord_messages table.");
  }
  this.createTable('discord_messages', {
    id: false
  }, function(){
    this.string('id', {
      not_null: true,
      primary: true
    });
    this.string('discord_channel_id', {
      not_null: true
    });
    this.string('discord_user_id', {
      references: 'discord_users.id'
    });
    this.text('content');
    this.jsonb('attachment_ids');
    this.timestamp();
  });
}
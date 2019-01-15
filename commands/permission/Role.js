const Command = require("../Permission.js");
const ROLES = require("../../constants/vehicle_roles");
class Role extends Command {
  constructor (client) {
    super(client, {
      name: "role",
      description: "Toggle a vehicle-themed role.",
      category: "Permissions",
      usage: "role <role>",
      guildOnly: true,
      aliases: ["togglerole", "getrole", "set-vehicle"],
      permLevel: "User"
    });
    
    this.availableRoles = ROLES;
  }

  async run (message, [roleChoice], level) { // eslint-disable-line no-unused-vars
    let member = message.member;
    // const roles = new Map(this.availableRoles);
    // First we need to retrieve current guild settings
    const settings = message.settings;
    if (roleChoice) {
      roleChoice = roleChoice.toLowerCase();
    }
    let rolesString = "";
    Object.keys(this.availableRoles).forEach((role) => {
      const roleKey = role;
      const roleLabel = this.availableRoles[role].discordRoleName;
      rolesString = rolesString.concat(roleKey + '\n')
    });
    if (!roleChoice) {
      message.reply('These are the available roles:\n'+
        rolesString +
        'Example: `-role honda` to join the Honda role.')

      return
    }
    const selectedRole = this.availableRoles[roleChoice];
    if (selectedRole) {
      console.log(selectedRole.discordRoleName);
      let myRole = message.guild.roles.find(role => role.name === selectedRole.discordRoleName);
      
      if(member.roles.has(myRole.id)) {
        member.roles.remove(myRole).catch(console.error);

        message.reply(`I have removed the *${selectedRole.discordRoleName}* role from you.`)
      } else {

        member.roles.add(myRole).catch(console.error);
        message.reply(`I have added the *${selectedRole.discordRoleName}* role to you.`)

      }
    } else {
      message.reply('That is not a valid role!\nThese are the available roles:\n'+
        rolesString +
        'Example: `-role honda` to join the Honda role.')

      return
    }
  }
}

module.exports = Role;
const Command = require("../Permission.js");

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
    
    this.availableRoles = [
      ["acura", "Acura"],
      ["chrysler", "Chrylser"],
      ["ford", "Ford"],
      ["gm", "General Motors"],
      ["genesis", "Genesis"],
      ["honda", "Honda"],
      ["hyundai", "Hyundai"
      ["kia", "Kia"],],
      ["lexus", "Lexus"],
      ["mazda", "Mazda"],
      ["subaru", "Subaru"],
      ["tesla", "Tesla"],
      ["toyota", "Toyota"],
      ["volkswagen", "Volkswagen"]
    ];
  }

  async run (message, [roleChoice], level) { // eslint-disable-line no-unused-vars
    let member = message.member;
    const roles = new Map(this.availableRoles);
    // First we need to retrieve current guild settings
    const settings = message.settings;
    if (roleChoice) {
      roleChoice = roleChoice.toLowerCase();
    }
    let rolesString = "";
    this.availableRoles.forEach((role) => {
      const roleKey = role[0];
      const roleLabel = role[1];
      rolesString = rolesString.concat('> ' + roleKey + '\n')
    })
    if (!roleChoice) {
      message.reply('These are the available roles:\n'+
        rolesString +
        'Example: `-role honda` to join the Honda role.')

      return
    }
    const selectedRole = roles.get(roleChoice);
    if (selectedRole) {
      let myRole = message.guild.roles.find(role => role.name === selectedRole);
      
      if(member.roles.has(myRole.id)) {
        member.roles.remove(myRole).catch(console.error);

        message.reply(`I have removed the *${selectedRole}* role from you.`)
      } else {

        member.roles.add(myRole).catch(console.error);
        message.reply(`I have added the *${selectedRole}* role to you.`)

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
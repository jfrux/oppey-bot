// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
const Command = require("../base/Command.js");

class Role extends Command {
  constructor (client) {
    super(client, {
      name: "role",
      description: "Toggle a vehicle-themed role.",
      category: "System",
      usage: "role <role>",
      guildOnly: true,
      aliases: ["togglerole", "getrole", "set-vehicle"],
      permLevel: "User"
    });
    
    this.availableRoles = [
      ["acura", "Acura Owner"],
      ["gm", "GM Owner"],
      ["honda", "Honda Owner"],
      ["tesla", "Tesla Owner"]
    ];
  }

  async run (message, [roleChoice], level) { // eslint-disable-line no-unused-vars
    let member = message.member;
    const roles = new Map(this.availableRoles);
    // First we need to retrieve current guild settings
    const settings = message.settings;
    let rolesString = "";
    this.availableRoles.forEach((role) => {
      const roleKey = role[0];
      const roleLabel = role[1];
      rolesString = rolesString.concat('> ' + roleKey + '\n')
    })
    if (!roleChoice) {
      message.reply('These are the available roles:\n'+
        rolesString +
        'use "-role `<role_name>` to join a role')

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
        'use "-role `<role_name>` to join a role')

      return
    }
  }
}

module.exports = Role;
const inflection = require("inflection");
const Command = require("../Permission.js");
const ROLES = require("../../constants/roles");
class Role extends Command {
  constructor (client) {
    super(client, {
      name: "role",
      description: "Toggle a role on/off of your profile.",
      category: "Permissions",
      usage: "role <name>",
      guildOnly: true,
      aliases: ["roles"],
      permLevel: "User"
    });
    this.roleGroups = Object.keys(ROLES);
    this.roles = ROLES;
  }

  async run (message, [roleChoice], level) { // eslint-disable-line no-unused-vars
    let member = message.member;
    const availableRoleKeys = {};
    const discordServerAdmin = this.client.channels.find(c => c.name === "discord-server-admin");
      
    const settings = message.settings;
    if (roleChoice) {
      roleChoice = roleChoice.toLowerCase().trim();
    }
    let rolesString = "";
    this.roleGroups.forEach((group,index) => {
      // console.log("Group:",group);
      
      rolesString = rolesString.concat(`\n**${inflection.titleize(group)}**`);
      // console.log(this.roles[group]);
      const roles = this.roles[group];
      const roleKeys = Object.keys(roles);
      rolesString = rolesString.concat('```yaml\n');
      roleKeys.forEach((role,roleIndex) => {
        const roleKey = role;
        const roleLabel = roles[role];
        availableRoleKeys[role] = roleLabel;
        let desc;
        switch (group) {
          case "MANUFACTURERS":
            desc = `For ${roleLabel} extended support.`;
          case "LOCATIONS":
            desc = `For ${roleLabel} location channels.`;
          case "MISC":
            desc = `For ${roleLabel} related topic channels.`;
        } 
        rolesString = rolesString.concat(`${roleKey}: ${desc}\n`);
      });
      rolesString = rolesString.concat('```');
    });
    if (!roleChoice) {
      discordServerAdmin.send(`${member}, choose one of these available roles...
${rolesString}
**ie. \`-role honda\` to join the Honda role.**\n
Request new roles be added in #discord-server-admin`);
      return
    }
    // console.log("roleChoice:",roleChoice);
    const selectedRole = availableRoleKeys[roleChoice];
    // console.log("selectedRole:",selectedRole);
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
      discordServerAdmin.send(`${member}, unfortunately that is not one of these available roles...
${rolesString}
**ie. \`-role honda\` to join the Honda role.**\n
Request new roles be added in #discord-server-admin`);
      return
    }
  }
}

module.exports = Role;
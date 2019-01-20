const inflection = require("inflection");
const { Command } = require('@yamdbf/core');
const ROLES = require("../../constants/roles");
const hitOnDm = `I sent you a DM with a list of the channel groups.`;
const footer = `
For example, \`-c honda\` to join the Honda channel group.\n
*BUT, don't do it here...*
**NOTE:** Please send commands back in the channels or it won't work.
If you have suggestions for how this can be better, feel free to reach out to us in #discord-server-admin...
Or send a DM to @jfrux...`;
module.exports = class extends Command
{
	constructor() {
		super({
      name: 'join',
			desc: 'Join a Channel Group',
			usage: '<prefix>join <channel_group>',
			info: 'Join a Channel Group',
			group: 'Chat',
			roles: ["Community Member"],
    });
    
    this.roleGroups = Object.keys(ROLES);
    this.availableRoles = ROLES;
	}

	action(message, [...roleChoice]) {
    let member = message.member;
    const availableRoleKeys = {};
    // const discordServerAdmin = this.client.channels.find(c => c.name === "discord-server-admin");
    console.warn("args:",arguments);
    const settings = message.settings;
    if (roleChoice) {
      roleChoice = roleChoice.join(" ").toLowerCase().trim();
    }
    let rolesString = "";
    this.roleGroups.forEach((group,index) => {
      // console.log("Group:",group);
      rolesString = rolesString.concat(`\n**${inflection.titleize(group)}**`);
      console.log(this.availableRoles[group]);
      const roles = this.availableRoles[group];
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
            break;
          case "LOCATIONS":
            desc = `For ${roleLabel} location channels.`;
            break;
          case "MISC":
            desc = `For ${roleLabel} related topic channels.`;
            break;
        } 
        rolesString = rolesString.concat(`${roleKey}: ${desc}\n`);
      });
      rolesString = rolesString.concat('```');
    });
    if (!roleChoice) {
      message.channel.send(`Hey ${member}! ${hitOnDm}`);
      
      member.send(`Here are the available channel groups...
${rolesString}
${footer}`);
      return
    }
    // console.log("roleChoice:",roleChoice);
    const selectedRole = availableRoleKeys[roleChoice];
    // console.log("selectedRole:",selectedRole);
    if (selectedRole) {
      let myRole = message.guild.roles.find(role => role.name === selectedRole);
      
      if(member.roles.has(myRole.id)) {
        // member.roles.remove(myRole).catch(console.error);

        message.reply(`You are already in the **${selectedRole}** channel group.`)
      } else {
        member.roles.add(myRole).catch(console.error);
        message.reply(`You have **joined** the **${selectedRole}** channel group.`)

      }
    } else {
      message.channel.send(`I can't find that on my list. ${hitOnDm}`);
      member.send(`Here are the available channel groups you can join...
${rolesString}
${footer}`);
      return
    }
	}
}
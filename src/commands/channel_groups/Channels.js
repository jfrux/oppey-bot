const inflection = require("inflection");
const Command = require("../../structures/Command");
const ROLES = require("../../constants/roles");
const hitOnDm = `I sent you a DM with a list of the channel groups.`;
const footer = `
For example, \`-join honda\` to join the Honda channel group.\n
*BUT, don't do it here...*
**NOTE:** Please send commands back in the channels or it won't work.
If you have suggestions for how this can be better, feel free to reach out to us in #discord-server-admin...`;
module.exports = class extends Command {
	constructor(client) {
		super(client, {
      name: 'channels',
      memberName: 'channels',
			description: 'Join / Leave a Channel Group',
			usage: '<prefix>channels <channel_group>',
			aliases: ['c','role'],
			info: 'Join / Leave a Channel Group',
			group: 'chat',
			// clientPermissions: [],
      // callerPermissions: [],
      examples: ['join Honda','leave Toyota', 'channels Honda'],
      guildOnly: true,
			roles: ["Community Member"],
      args: [
				{
					key: 'channel_group',
          prompt: 'Which channel group would you like to toggle?',
          type: 'string',
          default: ""
				}
			]
			// guildOnly: false,
			// ownerOnly: false,
			// hidden: false,
			// argOpts: { separator: ',' },
			// overloads: 'ping',
			// ratelimit: '1/10s'
    });
    
    this.roleGroups = Object.keys(ROLES);
    this.availableRoles = ROLES;
	}

  // TODO: Needs refactored to use master class to DRY up some of this code.
	async run(message, args) {
    let member = message.member;
    const availableRoleKeys = {};
    // const discordServerAdmin = this.client.channels.find(c => c.name === "discord-server-admin");
    let roleChoice = args['channel_group'];
    // const discordServerAdmin = this.client.channels.find(c => c.name === "discord-server-admin");
      
    const settings = message.settings;
    if (roleChoice.length) {
      roleChoice = roleChoice.toLowerCase().trim();
    }
    let rolesString = "";
    this.roleGroups.forEach((group,index) => {
      // console.log("Group:",group);
      rolesString = rolesString.concat(`\n**${inflection.titleize(group)}**`);
      // console.log(this.availableRoles[group]);
      const roles = this.availableRoles[group];
      const roleKeys = Object.keys(roles);
      rolesString = rolesString.concat('```yaml\n');
      roleKeys.forEach(async (role,roleIndex) => {
        const roleKey = role;
        const roleLabel = roles[role];
        availableRoleKeys[role] = roleLabel;
        console.log("roleLabel:",roleLabel);
        if (roleLabel) {
          let roleInfo = await message.guild.roles.find(role => role.name === roleLabel);
          let desc;
          if (roleInfo) {
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
          }
          rolesString = rolesString.concat(`${roleKey}: ${desc}\n`);
        }
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
        member.roles.remove(myRole).catch(console.error);

        message.reply(`You have **left** the **${selectedRole}** channel group.`)
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
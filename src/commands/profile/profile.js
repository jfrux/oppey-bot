const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
      group: 'me',
      guildOnly: false,
			memberName: 'profile',
			description: 'Responds with a user\'s profile.',
      example: [ `profle`, 'profile Oppey#0001', 'profile 0000000000000000000' ],
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to get the profile of?',
					type: 'user',
					default: message => message.author
				}
			]
		});
	}

	async run(message, { user }) {
    const client = this.client;
    const isDM = message.channel.type === "dm";
    const DiscordUser = client.orm.Model('DiscordUser');
    // const User = client.orm.Model("User");
    let discordUserModel = await DiscordUser.find(user.id);
    let userProfile = await discordUserModel.user;
    let isSelf = (message.author.id === user.id);
    if (!discordUserModel) {
      console.log("USER NOT FOUND, CREATING IT!");
      discordUserModel = await DiscordUser.create({
        id: user.id,
        avatar: user.displayAvatarURL(),
        username: user.username
      });
    }

    let profileData = [];
    const vehicles = await discordUserModel.discord_user_vehicles;
    if (vehicles) {
      let vehiclesOutput = [];
      vehicles.forEach((vehicle) => {
        console.log("vehicle:",vehicle)
        let vehicleString = [];
        if (vehicle.vehicle_year) {
          vehicleString.push(vehicle.vehicle_year);
        }
        if (vehicle.vehicle_make) {
          vehicleString.push(vehicle.vehicle_make);
        }
        if (vehicle.vehicle_model) {
          vehicleString.push(vehicle.vehicle_model);
        }
        if (vehicle.vehicle_trim) {
          vehicleString.push(vehicle.vehicle_trim);
        }
        vehiclesOutput.push(`${vehicleString.join(" ")}`)
      });

      if (vehicles.length) {
        profileData.push({
          name: 'Vehicles',
          value: vehiclesOutput.join("\n"),
          inline: true
        });
      } else {
        if (isSelf) {
          profileData.push({
            name: 'Vehicles',
            value: "No vehicles yet!\nAdd vehicles by running:\n `-add-vehicle year make model trim`",
            inline: true
          });
          message.author.send(`Did you know that you can edit your profile outside of Discord now?\nManage your profile and gain access to more resources and preferences.\nFollow the link below to update your profile:\nhttps://opc.ai/users/${message.author.username}/edit`);
        } else {
          profileData.push({
            name: 'Vehicles',
            value: "No vehicles yet!\nAsk them to use the `-add-vehicle` command.",
            inline: true
          });
        }
      }
    }

    if (userProfile) {
      if (userProfile.openpilot_experience) {
        profileData.push({
          name: 'Openpilot Experience',
          value: userProfile.openpilot_experience,
          inline: true
        });
      }
      let socialLinks = [];
      if (userProfile.youtube_channel_url) {
        socialLinks.push(`[[YouTube](${userProfile.youtube_channel_url})]`);
      }
      if (userProfile.github_username) {
        socialLinks.push(`[[GitHub](https://github.com/${userProfile.github_username})]`);
      }
      if (socialLinks.length) {
        profileData.push({
          name: 'Social',
          value: socialLinks.join(" "),
          inline: true
        })
      }
    }
    
    
    await message.author.send({
      embed: {
        author: {
          name: user.tag
        },
        fields: profileData,
        thumbnail: {
          url: discordUserModel && discordUserModel.avatar ? discordUserModel.avatar : user.displayAvatarUrl()
        },
        description: isSelf ? `[Manage your profile](https://opc.ai/users/${message.author.username}/edit)` : null,
        footer: {
          text: ``
        }
      }
    });
    if (isDM) return;
    if (isSelf) {
      let newMessage = await message.reply("I just sent you a DM with your profile info.");
      setTimeout(() => {
        newMessage.delete(500);
      },5000);
    } else {
      message.delete(500);
    }
	}
};
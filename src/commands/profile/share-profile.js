const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'share-profile',
      group: 'me',
      guildOnly: false,
      memberName: 'share-profile',
      aliases: ['show-profile','share-my-profile'],
			description: 'Shares your profile to the public channel.',
      example: [ `share-profile` ],
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to share the profile of?',
					type: 'user',
					default: message => message.author
				}
			]
		});
	}

	async run(message, { user }) {
    const messageUser = message.author;
    let discordUserModel = await this.fetchDbUser(messageUser);
    let userProfile = await discordUserModel.user;
    let isSelf = (message.author.id === user.id);

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
    
    
    await message.channel.send({
      embed: {
        author: {
          name: user.tag
        },
        fields: profileData,
        thumbnail: {
          url: discordUserModel && discordUserModel.avatar ? discordUserModel.avatar : user.displayAvatarUrl()
        },
        footer: {
          text: ``
        }
      }
    });
    // if (isDM) return;
    // if (isSelf) {
    //   let newMessage = await message.reply("I just sent you a DM with your profile info.");
    //   setTimeout(() => {
    //     newMessage.delete(500);
    //   },5000);
    // } else {
    //   message.delete(500);
    // }
	}
};
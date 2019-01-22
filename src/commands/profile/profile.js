const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'me',
			memberName: 'profile',
			description: 'Responds with a user\'s profile.',
      example: [ `profle`, 'profile @Oppey#0001', 'profile 0000000000000000000' ],
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
    const User = client.orm.Model('DiscordUser');
    
    let userModel = await User.find(user.id);
    let isSelf = (message.author.id === user.id);
    if (!userModel) {
      console.log("USER NOT FOUND, CREATING IT!");
      userModel = await User.create({
        id: user.id,
        avatar: user.displayAvatarURL(),
        username: user.username
      });
    }

    let profileData = [];
    const vehicles = await userModel.discord_user_vehicles;
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
        vehiclesOutput.push(`**${vehicleString.join(" ")}**`)
      })
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
            value: "No vehicles yet!\nAdd vehicles by running:\n `-add-vehicle <year> <make> <model> <trim>`",
            inline: true
          });
        } else {
          profileData.push({
            name: 'Vehicles',
            value: "No vehicles yet!\nAsk them to use the `-add-vehicle` command.",
            inline: true
          });
        }
      }
    }
    await message.channel.send({
      embed: {
        author: {
          name: user.tag
        },
        fields: profileData,
        thumbnail: {
          url: userModel && userModel.avatar ? userModel.avatar : user.displayAvatarUrl()
        },
        footer: {
          text: ``
        }
      }
    });
	}
};
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
    // if (message.mentions.users.size) {
    //   user = message.mentions.users.first();
    // } else if (args.id) {
    //   user = await client.utils.fetchMember(message.guild, args.id);
    //   if (user) {
    //     user = user.user;
    //   }
    // }
    // if (!user) {
    //   user = message.author;
    // }
    console.log("models",client.database.models);

    let userModel = await client.database.models.discord_user.findOne({
      attributes: [ 'avatar', 'info', 'location' ],
      where: {
        userid: user.id
      }
    });

    if (!userModel) {
      userModel = await client.database.models.discord_user.create({
        userid: user.id,
        avatar: user.displayAvatarURL(),
        username: user.username
      });
    }
    let info;
    if (userModel && userModel.dataValues.info) {
      info = await client.utils.decompressString(userModel.dataValues.info);
    }

    let profileData = [];

    if (userModel && userModel.dataValues.location) {
      profileData.push({
        name: 'Location',
        value: userModel.dataValues.location,
        inline: true
      });
    }
    const vehicles = await userModel.getVehicles();
    if (vehicles) {
      let vehiclesOutput = [];
      vehicles.forEach((vehicle) => {
        vehiclesOutput.push(`**${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}**`)
      })
      profileData.push({
        name: 'Vehicles',
        value: vehiclesOutput.join("\n"),
        inline: true
      });
    }
    await message.channel.send({
      embed: {
        author: {
          name: user.tag
        },
        fields: profileData,
        thumbnail: {
          url: userModel && userModel.dataValues.avatar ? userModel.dataValues.avatar : user.displayAvatarUrl()
        },
        footer: {
          text: ``
        }
      }
    });
	}
};
const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-vehicle',
			group: 'me',
			memberName: 'add-vehicle',
			description: 'Adds a vehicle to your profile.',
      example: [ 'add-vehicle 2017 Honda Pilot', 'add-vehicle 2019 Honda Accord Touring' ],
			args: [
				{
					key: 'year',
					prompt: 'What year is the vehicle? (i.e. 2017)',
          type: 'integer',
          validate: text => {
            if (text.length === 4) return true;
            return 'Year must be 4 digits.';
          }
        },
        {
					key: 'make',
					prompt: 'What make is the vehicle? (i.e. Toyota, Honda, etc.)',
					type: 'string'
				},
        {
					key: 'model',
					prompt: 'What model is the vehicle? (i.e. Prius, Pilot, etc.)',
					type: 'string'
				},
        {
					key: 'trim',
					prompt: 'What model is the vehicle? (i.e. Prius, Pilot, etc.)',
          type: 'string',
          default: ''
				}
			]
		});
	}

	async run(message, { year, make, model, trim }) {
    const client = this.client;
    const user = message.author;
    
    let userModel = await client.database.models.discord_user.findOne({
      attributes: [ 'avatar', 'info', 'username' ],
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

    let vehicle = {
      userid: user.id,
      year,
      make,
      model,
      trim
    }
    let profileData = [];

    if (userModel && userModel.dataValues.username) {
      profileData.push({
        name: 'Username',
        value: userModel.dataValues.username,
        inline: true
      });
    }
    console.log("Adding vehicle...",vehicle);
    
    let userVehicle = await client.database.models.discord_user_vehicle.create(
      vehicle
    )
    
    await userModel.reload()
    console.log(userModel);
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
}
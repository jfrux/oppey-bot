const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete-vehicle',
			group: 'me',
			memberName: 'delete-vehicle',
			description: 'Deletes a vehicle from your profile.',
      example: [ 'delete-vehicle 2017 Honda Pilot', 'add-vehicle 2019 Honda Accord Touring' ],
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
          type: 'string'
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
      message.reply("You have not added any vehicles to your profile yet.");
      return;
    }

    let vehicle = {
      userid: user.id,
      year,
      make,
      model,
      trim
    }
    console.log("Deleting vehicle...", vehicle);
    let userVehicle = await client.database.models.discord_user_vehicle.findOne({
      where: {
        userid: user.id,
        year,
        make,
        model,
        trim
      }
    });
    
    if (userVehicle) {
      userVehicle.destroy({
        force: true
      })
    }
  }
}
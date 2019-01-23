const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete-vehicle-from',
			group: 'moderation',
			userPermissions: ['MANAGE_MESSAGES','MANAGE_CHANNELS'],
      memberName: 'delete-vehicle-from',
			guildOnly: true,
			description: 'Deletes a vehicle from your profile.',
      example: [ 'delete-vehicle 2017 Honda Pilot', 'delete-vehicle 2019 Honda Accord Touring' ],
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to delete the vehicle from?',
					type: 'user'
        },
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
					prompt: 'What trim is the vehicle? (i.e. Touring, EX-L, etc.)',
          type: 'string',
          default: ""
				}
			]
		});
	}

	async run(message, { user, year, make, model, trim }) {
    const client = this.client;
    const User = client.orm.Model('DiscordUser');
    const messageUser = message.author;
    
    let userModel = await User.find(user.id);

    if (!userModel) {
      message.channel.send(`${user} does not have any vehicles yet.`);
      return;
    }

    trim = trim.length ? trim : null
    let vehicle = {
      discord_user_id: user.id,
      vehicle_year: year,
      vehicle_make: inflection.titleize(make),
      vehicle_model: inflection.capitalize(model),
      vehicle_trim: trim
    }
    
    let vehiclesToDelete = await userModel.discord_user_vehicles.where(vehicle).then((results) => {
      console.log("Deleting Record:",results.toJSON());
      results.forEach(async (result) => {
        await result.destroy();
      });
      if (results.length) {
        message.channel.send(`I deleted that vehicle from ${user}'s profile`);
      
      } else {
        message.channel.send(`I could not find that vehicle in ${user}'s profile.`);
      }
    });
  }
}
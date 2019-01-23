const Command = require('../../structures/Command');
const inflection = require("inflection");
module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-vehicle',
			group: 'me',
			memberName: 'add-vehicle',
			description: 'Adds a vehicle to your profile.',
      example: [ "add-vehicle 2017 Honda Pilot", "add-vehicle 2018 Toyota RAV4 'XLE Hybrid'", "add-vehicle 2018 'Alfa Romeo' Giulia" ],
			args: [
				{
					key: 'year',
					prompt: `What year is the vehicle? (i.e. ${new Date().getFullYear()}`,
          type: 'integer',
          validate: text => {
            if (text.length === 4) return true;
            return 'Year must be 4 digits.';
          }
        },
        {
					key: 'make',
					prompt: 'What make is the vehicle?\ni.e. Toyota, \'Alfa Romeo\', Honda, etc.\nWrap multi-word makes with single-quote.',
					type: 'string'
				},
        {
					key: 'model',
					prompt: 'What model is the vehicle?\ni.e. Prius, Pilot, etc.',
					type: 'string'
				},
        {
					key: 'trim',
					prompt: 'What model is the vehicle?\ni.e. Prius, Pilot, etc.',
          type: 'string',
          default: ''
				}
			]
		});
	}

	async run(message, { year, make, model, trim }) {
    const client = this.client;
    const User = client.orm.Model('DiscordUser');
    const UserVehicle = client.orm.Model('DiscordUserVehicle');
    const messageUser = message.author;
    
    let user = await User.find(messageUser.id);

    if (!user) {
      console.log("USER NOT FOUND, CREATING IT!");
      user = await User.create({
        id: messageUser.id,
        avatar: messageUser.displayAvatarURL(),
        username: messageUser.username
      });
    }

    trim = trim.length ? trim : null
    let vehicle = {
      discord_user_id: user.id,
      vehicle_year: year,
      vehicle_make: inflection.titleize(make),
      vehicle_model: inflection.capitalize(model),
      vehicle_trim: inflection.capitalize(trim)
    }
    let profileData = [];

    if (messageUser && messageUser.username) {
      profileData.push({
        name: 'Username',
        value: messageUser.username,
        inline: true
      });
    }
    console.log("Adding vehicle...",vehicle);
    
    let vehicleMatches = await user.discord_user_vehicles.where(vehicle);
    console.log("vehicleMatches:",JSON.stringify(vehicleMatches));
    if (vehicleMatches.length) {
      message.reply("You have already added this vehicle to your profile.");
      return;
    }

    const vehicles = await user.discord_user_vehicles;
    await vehicles.create(vehicle);
    message.reply("I added that vehicle to your profile.");
  }
}
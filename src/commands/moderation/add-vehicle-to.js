const Command = require('../../structures/Command');
const inflection = require("inflection");
module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-vehicle-to',
      group: 'moderation',
      memberName: 'add-vehicle-to',
      guildOnly: true,
			description: 'Adds a vehicle to a user\'s profile.',
      example: [ 'add-vehicle-to @jfrux#0001 2017 Honda Pilot', 'add-vehicle-to @jfrux#0001 2019 Honda Accord Touring' ],
			args: [
        {
					key: 'user',
					prompt: 'Which user do you want to add the vehicle to?',
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
					prompt: 'What model is the vehicle? (i.e. Prius, Pilot, etc.)',
          type: 'string',
          default: ''
				}
			]
		});
	}

	async run(message, { user, year, make, model, trim }) {
    const adminrole = message.guild.settings.get('adminrole');
    const modrole = message.guild.settings.get('modrole');
    const modlog = message.guild.settings.get('modlog');
    if (!adminrole || !modrole || !modlog) return message.reply(`This command is not set up to work! Have someone run \`${message.guild.commandPrefix}settings\` to add the \`admin\` and \`modlog\` settings.`);
    if (!message.member.roles.has(modrole)) {
      if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this!\`Role Required: ${message.guild.roles.get('modrole')}\`, this is changeable with \`${message.guild.commandPrefix}set add mod @role\``);
    }
    const client = this.client;
    const User = client.orm.Model('DiscordUser');
    const UserVehicle = client.orm.Model('DiscordUserVehicle');
    const messageUser = message.author;
    
    let userModel = await User.find(user.id);

    if (!userModel) {
      console.log("USER NOT FOUND, CREATING IT!");
      userModel = await User.create({
        id: user.id,
        avatar: user.displayAvatarURL(),
        username: user.username
      });
    }

    trim = trim.length ? inflection.capitalize(trim) : null
    let vehicle = {
      discord_user_id: user.id,
      vehicle_year: year,
      vehicle_make: inflection.titleize(make),
      vehicle_model: inflection.capitalize(model),
      vehicle_trim: trim
    }
    let profileData = [];

    if (user && user.username) {
      profileData.push({
        name: 'Username',
        value: user.username,
        inline: true
      });
    }
    
    let vehicleMatches = await userModel.discord_user_vehicles.where(vehicle);
    if (vehicleMatches.length) {
      message.channel.send(`${user} already has this vehicle.`);
      return;
    }

    const vehicles = await userModel.discord_user_vehicles;
    await vehicles.create(vehicle);
    message.channel.send(`I added that vehicle to ${user}'s profile`);
  }
}
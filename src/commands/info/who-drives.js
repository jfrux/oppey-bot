const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'who-drives',
			memberName: 'who-drives',
      group: 'info',
      guildOnly: false,
      aliases: ['looking-for'],
      userPermissions: ['MANAGE_MESSAGES'],
			description: 'Responds with a user\'s that drive a particular vehicle.',
      example: [ 'who-drives "Honda" "Pilot"' ],
			args: [
				{
					key: 'make',
					prompt: 'What make do you want to search?\n(wrap in quotes if it has spaces)',
					type: 'string'
        },
        {
					key: 'model',
					prompt: 'What model do you want to search?\n(wrap in quotes if it has spaces)',
					type: 'string'
				}
			]
		});
	}

	async run(message, { make, model }) {
    const client = this.client;
    const isDM = message.channel.type === "dm";
    const DiscordUserVehicle = client.orm.Model('DiscordUserVehicle');
    // const User = client.orm.Model("User");
    let discordUserVehicles = await DiscordUserVehicle.where({ vehicle_make: make, vehicle_model: model});
    let usersFound = [];

    discordUserVehicles.forEach((vehicle) => {
      if (vehicle.discord_user_id !== message.author.id) {
        usersFound.push(`<@${vehicle.discord_user_id}>`);
      }
    })

    console.log(usersFound);
    message.channel.send(`${message.author} is seeking assistance from other ${make} ${model} owners...\n${usersFound.join(" ")}`);
	}
};
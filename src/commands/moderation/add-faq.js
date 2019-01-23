const Command = require('../../structures/Command');
const inflection = require("inflection");
module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-faq',
			group: 'me',
			memberName: 'add-faq',
			description: 'Adds a new FAQ.',
      example: [ 'add-faq' ],
			args: [
				{
					key: 'question',
					prompt: `What is the question?`,
          type: 'string'
        },
        {
					key: 'answer',
					prompt: `What is the answer?`,
          type: 'string'
        }
			]
		});
	}

	async run(message, { question, answer }) {
    const client = this.client;
    // const User = client.orm.Model('DiscordUser');
    // const UserVehicle = client.orm.Model('DiscordUserVehicle');
    // const messageUser = message.author;
    
    // let user = await User.find(messageUser.id);

    // if (!user) {
    //   console.log("USER NOT FOUND, CREATING IT!");
    //   user = await User.create({
    //     id: messageUser.id,
    //     avatar: messageUser.displayAvatarURL(),
    //     username: messageUser.username
    //   });
    // }

    // trim = trim.length ? trim : null
    // let vehicle = {
    //   discord_user_id: user.id,
    //   vehicle_year: year,
    //   vehicle_make: make,
    //   vehicle_model: model,
    //   vehicle_trim: trim
    // }
    // let profileData = [];

    // if (messageUser && messageUser.username) {
    //   profileData.push({
    //     name: 'Username',
    //     value: messageUser.username,
    //     inline: true
    //   });
    // }
    // console.log("Adding vehicle...",vehicle);
    
    // let vehicleMatches = await user.discord_user_vehicles.where(vehicle);
    // console.log("vehicleMatches:",JSON.stringify(vehicleMatches));
    // if (vehicleMatches.length) {
    //   message.reply("You have already added this vehicle to your profile.");
    //   return;
    // }

    // const vehicles = await user.discord_user_vehicles;
    // await vehicles.create(vehicle);
    // message.reply("I added that vehicle to your profile.");
  }
}
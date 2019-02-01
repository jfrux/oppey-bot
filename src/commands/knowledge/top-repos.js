const Command = require('../../structures/Command');
const {stripIndents} = require("common-tags");
module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'top-repos',
			memberName: 'top-repos',
      group: 'knowledge',
      guildOnly: false,
      aliases: ['top-forks'],
			description: 'Outputs the top repos.',
      example: [ 'top-repos', 'top-repos openpilot' ],
			args: [
				{
					key: 'reponame',
					prompt: 'Which reponame do you want to filter by?\n(i.e. openpilot)',
          type: 'string',
          default: "openpilot"
        },
        {
					key: 'limit',
					prompt: 'How many would you like to limit it by?',
          type: 'integer',
          default: 10
        }
			]
		});
	}

	async run(message, { reponame, limit }) {
    const client = this.client;
    const isDM = message.channel.type === "dm";
    const DiscordUserRepositories = client.orm.Model('DiscordUserRepositories');
    
    console.log("repoName",reponame);
    let repositories = await DiscordUserRepositories
      .select(`count(repository_name), repository_name`)
      .group(`repository_name`)
      .where(`repository_name like '%\/${reponame}'`)
      .limit(limit)
      .order("count(repository_name)", true);
    // let groupedRepos = repositories.count('repository_name');
    let reposFound = [];
    console.log(repositories);
    repositories.forEach((repo) => {
      reposFound.push(`- ${repo.repository_name} [${repo.count}]`);
    });

    console.log(reposFound);
    message.channel.send(stripIndents`Here are the top favorited ${reposFound.length} ${reponame} repos:
    ${reposFound.join('\n')}`);
	}
};
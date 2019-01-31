const { GITHUB_TOKEN } = process.env;
const Command = require('../../structures/Command.js');
const inflection = require("inflection");
const Octokit = require('@octokit/rest');
const github = new Octokit({
  auth: `token ${GITHUB_TOKEN}`
});
module.exports = class AddVehicleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-my-repo',
      memberName: 'add-my-repo',
      group: 'me',
      aliases:  ['profile-add-repo', 'fav-repo'],
			description: 'Adds a GitHub repo to your favorites.',
      example: [ "add-my-repo commaai/openpilot", "add-my-repo arne182/openpilot" ],
			args: [
				{
					key: 'repo',
					prompt: 'Which repo do you want to add? (example: `commaai/openpilot`)',
          type: 'string',
          wait: 0,
          validate: async (repo) => {
            const regexPattern = /[a-zA-Z0-9]+\/[a-zA-Z0-9]+/;
            const repoRegex = new RegExp(regexPattern);
            let repoLookup, repoParts, ownername, reponame;
            const isRepoName = repoRegex.test(repo);
            if (isRepoName) {
              repoParts = repo.split('/');
              ownername = repoParts[0];
              reponame = repoParts[1];
              try {
                repoLookup = await github.repos.get({owner:ownername, repo:reponame});

                if (repoLookup) {
                  // console.log("Found repo on GitHub!",repoLookup);
                  return true;
                }
              } catch (e) {
                console.log("[ERROR] User entered invalid repository name");
              }
            };
            return `:cry: Repository not found or invalid!
\`\`\`css
${client.commandPrefix}profile-add-repo owner_name/repo_name'
\`\`\`
`;
          }
        }
			]
		});
	}

	async run(message, { repo }) {
    const client = this.client;
    const Repository = client.orm.Model('Repository');
    const messageUser = message.author;
    
    const user = await this.fetchDbUser(messageUser);
    let dbRepo = await Repository.where({ full_name: repo }).first();
    
    if (!dbRepo) {
      const repoParts = repo.split('/');
      const ownername = repoParts[0];
      const reponame = repoParts[1];
      let ghRepo = await github.repos.get({owner:ownername, repo:reponame});
      
      dbRepo = await Repository.create({ 
        name: ghRepo.name,
        full_name: ghRepo.full_name,
        owner_login: ghRepo.owner.login,
        owner_avatar_url: ghRepo.owner.avatar_url,
        owner_url: ghRepo.owner.url,
        url: ghRepo.html_url
      });
    }

    console.log('dbRepoId',dbRepo);

    let user_repo = {
      discord_user_id: user.id,
      repository_name: repo,
      repository_id: dbRepo.id
    }

    // let new_user_repo = await user.discord_user_repositories.create(user_repo);
    
    let repoMatches = await user.discord_user_repositories.where(user_repo);
    
    if (repoMatches.length) {
      message.reply(`:white_check_mark:  **${repo}** is already in your favorite repositories.`);
      return;
    }

    const userRepos = await user.discord_user_repositories;
    await userRepos.create(user_repo);
    message.reply(`:white_check_mark:  **${repo}** is now in your favorite repositories.`);
  }
}
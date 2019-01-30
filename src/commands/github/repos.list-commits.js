const Command = require('../../structures/commands/GitHub');
const { MessageEmbed } = require('discord.js');
// const request = require('node-superfetch'); 
const moment = require("moment");
// const { shorten, base64 } = require('../../../util/Util');
module.exports = class ChangelogCommand extends Command {
	constructor(client) {
		super(client, {
      githubMethod: 'listCommits',
      githubGroup: 'repos',
      useEmbed: true
    });
	}
  /**
   * getDescription
   * @param {*} json 
   */
  _getEmbedDescription(json) {
    return `${json.commit.message.substring(150,300).replace(/\n/g,'').replace(/\r/g,'')}

[View Commit on GitHub](${json.html_url})`;
  }
  
  _getEmbedTitle(json) {
    let commitMessage;
    const commitSplit = json.commit.message.split(/\(\#[0-9]+\)/);
    if (commitSplit.length) {
      //has PR
      commitMessage = json.commit.message.split(')')[0].replace("(","");
    } else {
      //regular text
      commitMessage = json.commit.message.substring(0,150).replace(/\n/g,'').replace(/\r/g,'');
    }
    return commitMessage
  }

  _getEmbedAuthor(json) {
    // {
    //   name: resp.author.name,
    //   iconURL: resp.author.image
    // }
    if (json.author) {
      return {
        name: json.author.login,
        iconURL: json.author.avatar_url
      };
    }
  }

  _getEmbedImage(json) {
    // {
    //   url: json.image
    // }
    return null;
  }

  _getEmbedThumbnail(json) {
    // {
    //   url: json.image
    // }
    return null;
  }

  _getEmbedUrl(json) {
    // {
    //   url: json.url
    // }
    return null;
  }

  _getEmbedFields(json) {
    // fields = [];
    //   fields.push({
    //     name: field.name,
    //     value: field.value,
    //     inline: true
    //   })
    return null;
  }

  _getEmbedColor(json) {
    // 0x00AE86;
    return 0x00AE86;
  }

  _getEmbedFooter(json) {
    // Some message for the footer;
    let authorName,authorImage,committerName,committerImage,date;
    if (json.author) {
      authorName = json.author.login;
      authorImage = json.author.avatar_url;
    }
    if (json.committer) {
      committerName = json.committer.login;
      committerImage = json.committer.avatar_url;
      date = moment(json.commit.committer.date).calendar();
    }
    

    let footer = [];

    // if (authorName !== committerName) {
    //   footer.push(`${authorName} authored and`)
    // }

    if (committerName && date) {
      footer.push(`${committerName} committed on ${date}`);
    }
    if (footer.length) {
      return {
        iconURL: committerImage,
        text: footer.join(" ")
      }
    }
  }
	// async run(msg) {
	// 	const { body } = await request
	// 		.get(`https://api.github.com/repos/${XIAO_GITHUB_REPO_USERNAME}/${XIAO_GITHUB_REPO_NAME}/commits`)
	// 		.set({ Authorization: `Basic ${base64(`${GITHUB_USERNAME}:${GITHUB_PASSWORD}`)}` });
	// 	const commits = body.slice(0, 10);
	// 	const embed = new MessageEmbed()
	// 		.setTitle(`[${XIAO_GITHUB_REPO_NAME}:master] Latest 10 commits`)
	// 		.setColor(0x7289DA)
	// 		.setURL(`https://github.com/${XIAO_GITHUB_REPO_USERNAME}/${XIAO_GITHUB_REPO_NAME}/commits/master`)
	// 		.setDescription(commits.map(commit => {
	// 			const hash = `[\`${commit.sha.slice(0, 7)}\`](${commit.html_url})`;
	// 			return `${hash} ${shorten(commit.commit.message.split('\n')[0], 50)} - ${commit.author.login}`;
	// 		}).join('\n'));
	// 	return msg.embed(embed);
	// }
};
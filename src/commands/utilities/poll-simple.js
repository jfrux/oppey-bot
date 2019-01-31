const { Command } = require("discord.js-commando");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const moment = require("moment-timezone");
const path = require("path");
module.exports = class VoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "yesno",
      group: "polls",
      memberName: "yesno",
      description: "Starts a yes/no poll.",
      examples: ['yesno "Do you like to vote?" 5'],
      aliases: ['yes-or-no','yesno','yesorno'],
      args: [
        {
          key: "question",
          prompt: "What is the yes/no question?",
          type: "string"
        },
        {
          key: 'runtime',
          label: 'runtime',
          prompt: 'How many minutes do you want to run this for? (between 1 and 60)',
          type: 'integer'
        }
      ]
    });
  }

  async run(msg, { question, runtime }) {
    var emojiList = ["👍", "👎", "🤷"];
    var embed = new MessageEmbed()
      .setTitle(question)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL())
      .setColor(0xd53c55) // Green: 0x00AE86
      .setTimestamp();
    const runtimeTimestamp = moment().tz("America/New_York").add(runtime,'minutes');
    // 2019-09-24T20:35
    // Promise.promisifyAll( CountdownGenerator );
    // await CountdownGenerator.initAsync(runtimeTimestamp, 150, 50, '#FFFFFF', '#000000', "countdown", 30);
    // console.log("Saving file to:",filePath);
    // const base64str = base64_encode(filePath);
    // const imageUrl = "https://oppey-countdown.herokuapp.com/serve?time=" + runtimeTimestamp.format("YYYY-MM-DDTHH:mm:ss") + "&name=serve1";
    // embed.setDescription(`![](${imageUrl})`)
    // await fs.unlink(filePath);
    if (runtime) {
      embed.setFooter(`Poll is open and will remain open until ${runtimeTimestamp.calendar()} ${runtimeTimestamp.format("zz")}`);
    }
    // embed.files = [file];
    //msg.delete(); // Remove the user's command message

    let message = await msg.channel.send({ embed }); // Use a 2d array?

    var reactionArray = [];
    reactionArray[0] = await message.react(emojiList[0]);
    reactionArray[1] = await message.react(emojiList[1]);
    reactionArray[2] = await message.react(emojiList[2]);

    if (runtime) {
      setTimeout(async () => {
        // Re-fetch the message and get reaction counts
        message = await message.channel.messages.fetch(message.id);

        var reactionCountsArray = [];
        for (var i = 0; i < reactionArray.length; i++) {
          reactionCountsArray[i] =
            message.reactions.get(emojiList[i]).count - 1;
        }

        // Find winner(s)
        var max = -Infinity,
          indexMax = [];
        for (var i = 0; i < reactionCountsArray.length; ++i)
          if (reactionCountsArray[i] > max)
            (max = reactionCountsArray[i]), (indexMax = [i]);
          else if (reactionCountsArray[i] === max) indexMax.push(i);

        // Display winner(s)
        console.log(reactionCountsArray); // Debugging votes
        var winnersText = "";
        if (reactionCountsArray[indexMax[0]] == 0) {
          winnersText = "No one voted!";
        } else {
          for (var i = 0; i < indexMax.length; i++) {
            winnersText +=
              emojiList[indexMax[i]] +
              " (" +
              reactionCountsArray[indexMax[i]] +
              " vote(s))\n";
          }
        }
        embed.addField("**Winner(s):**", winnersText);
        embed.setFooter(`The vote is now closed! It lasted ${runtime} minute(s)`);
        message.edit("", embed);
      }, runtime * 60 * 1000);
    }
  }
};

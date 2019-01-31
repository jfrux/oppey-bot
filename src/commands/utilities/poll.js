const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { oneLine } = require("common-tags");
const moment = require("moment-timezone");
module.exports = class PollCommand extends Command {
  constructor(client) {
    super(client, {
      name: "poll",
      group: "polls",
      memberName: "poll",
      description: "Creates a poll with up to 10 choices.",
      examples: [
        'poll "What\'s your favourite food?" "Hot Dogs,Pizza,Burgers,Fruits,Veggies" 10'
      ],
      args: [
        {
          key: "question",
          prompt: "What is the poll question?",
          type: "string",
          validate: question => {
            if (question.length < 101 && question.length > 11) return true;
            return "Polling questions must be between 10 and 100 characters in length.";
          }
        },
        {
          key: "options",
          prompt: "What options do you want for the poll? (surround with quotes, separate by comma)",
          type: "string",
          validate: options => {
            var optionsList = options.split(",");
            if (optionsList.length > 1) return true;
            return "Polling options must be greater than one.";
          }
        },
        {
          key: "runtime",
          prompt: "How long should the poll last? (1 to 60 minutes)",
          type: "integer",
          default: 5,
          validate: runtime => {
            if (runtime >= 1 && runtime <= 60) return true;
            return "Polling time must be between 1 and 60.";
          }
        }
      ]
    });
  }

  async run(msg, { question, options, runtime }) {
    var emojiList = [
      "1⃣",
      "2⃣",
      "3⃣",
      "4⃣",
      "5⃣",
      "6⃣",
      "7⃣",
      "8⃣",
      "9⃣",
      "🔟"
    ];
    var optionsList = options.split(",");

    var optionsText = "";
    for (var i = 0; i < optionsList.length; i++) {
      optionsText += emojiList[i] + " " + optionsList[i] + "\n";
    }

    var embed = new MessageEmbed()
      .setTitle(question)
      .setDescription(optionsText)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL())
      .setColor(0xd53c55)
      const runtimeTimestamp = moment().tz("America/New_York").add(runtime,'minutes');
      if (runtime) {
        embed.setFooter(`Poll is open until ${runtimeTimestamp.calendar()} ${runtimeTimestamp.format("zz")}`);
      }

    //msg.delete(); // Remove the user's command message

    let message = await msg.channel.send({ embed }); // Definitely use a 2d array here..
    var reactionArray = [];
    for (var i = 0; i < optionsList.length; i++) {
      reactionArray[i] = await message.react(emojiList[i]);
    }

    if (runtime) {
      setTimeout(async () => {
        // Re-fetch the message and get reaction counts
        message = await message.channel.messages.fetch(message.id);
        var reactionCountsArray = [];
        for (var i = 0; i < optionsList.length; i++) {
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
              " " +
              optionsList[indexMax[i]] +
              " (" +
              reactionCountsArray[indexMax[i]] +
              " vote(s))\n";
          }
        }

        embed.addField("**Winner(s):**", winnersText);
        embed.setFooter(
          `The poll is now closed! It lasted ${runtime} minute(s)`
        );
        embed.setTimestamp();

        message.edit("", embed);
      }, runtime * 60 * 1000);
    }
  }
};

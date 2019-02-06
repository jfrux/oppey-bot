const { DMChannel } = require("discord.js");
const dialogflow = require('dialogflow');
const { DIALOGFLOW_PROJECT_ID, DIALOGFLOW_CREDENTIALS_EMAIL, DIALOGFLOW_CREDENTIALS_PRIVATE_KEY } = process.env;

const uuid = require('uuid');
module.exports = async (client,message) => {
  const DiscordUser = client.orm.Model('DiscordUser');
  const DiscordMessage = client.orm.Model('DiscordMessage');
  const excludeChannels = require("../constants/exclude_channels.js");
  const excludeUsers = require("../constants/exclude_users.js");
  const isDM = message.channel instanceof DMChannel;
  const isCommand = message.content.startsWith(`${client.commandPrefix}history`) || message.content.startsWith(`${client.commandPrefix} history`);
  if (message.author == client.user) {
    return;
  }

  // Check if the bot's user was tagged in the message
  const didMentionOppey = message.content.includes(client.user.toString()) || message.content.includes("Oppey") || message.content.includes("Opps") || message.content.includes("oppey-bot");
  // console.log("didMentionOppey:",didMentionOppey);
  if (!isCommand && !isDM && !excludeUsers.includes(parseInt(message.author.id)) && !excludeChannels.includes(parseInt(message.channel.id))) {
    try {
      let discordMessageModel = DiscordMessage.create({
        id: message.id,
        content: message.content,
        discord_user_id: message.author.id,
        discord_channel_id: message.channel.id,
        attachment_ids: {
          ...message.attachments.array()
        },
        jump_url: message.url
      });
    } catch (e) {
      console.error("Failed to archive message...",e);
    }

    try {
      let discordUserModel = DiscordUser.find(message.author.id);
      if (discordUserModel) {
        discordUserModel.update({
          last_seen_at: new Date(),
          last_seen_in: message.channel.id
        });
      }
    } catch (e) {
      console.error("Failed to update last seen...",e);
    }
  }

  const isBotChannel = message.channel.name === 'ask-oppey-the-bot';
  const hasQuestionMark = message.content.includes("?") || message.content.endsWith("?");
  let plainMessage;
  if (isDM || didMentionOppey || isBotChannel || hasQuestionMark) {
    plainMessage = message.content;
    const sessionId = uuid.v4();
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({
      credentials: {
        client_email: DIALOGFLOW_CREDENTIALS_EMAIL,
        private_key: DIALOGFLOW_CREDENTIALS_PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    });
    const sessionPath = sessionClient.sessionPath(DIALOGFLOW_PROJECT_ID, sessionId);
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: plainMessage,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    // console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);
    const isDefaultIntent = result.intent ? result.intent.displayName === 'Default Fallback Intent' : false;
    const responseText = result.fulfillmentText;
    let responseFunction;

    if (isDM) {
      // responseFunction = message.reply;
      message.author.send(responseText);
    }

    if (isBotChannel && didMentionOppey) {
      // responseFunction = message.channel.send;
      message.channel.send(responseText);
      return;
    } else if (isBotChannel && hasQuestionMark) {
      message.channel.send(responseText);
      return;
    }
    if (!isBotChannel && didMentionOppey) {
      // responseFunction = message.reply;
      message.channel.send(responseText);
      return;
    }

    if (isBotChannel || isDM) {
      message.channel.send(responseText);
      return;
    }
    
    // console.log(responseFunction);
    // console.log(responseText);
    // await responseFunction(responseText);
  }
};

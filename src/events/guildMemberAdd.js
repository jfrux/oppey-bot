const moment = require("moment");
const MEMBER_ROLE = require("../constants/member_role");
module.exports = class {
  constructor (client) {
    this.client = client;
  }
  
  async run (member) {
    this.client.logger.info(`[guildMemberAdd] New member has joined: ${member}`);
    const currentTime = moment();
    const discordMemberRole = member.guild.roles.find(role => role.name === MEMBER_ROLE);
    // let otherUser = this.client.users.find(user => user.username == "jfrux");
    // let anotherUser = this.client.users.find(user => user.username == "Oppey");
    // let lastUser = this.client.users.find(user => user.username == "OPCServerOwner");
    // this.client.newUsers.set(otherUser.id, otherUser);
    // this.client.newUsers.set(anotherUser.id, anotherUser);
    // this.client.newUsers.set(lastUser.id, lastUser);

    let newUsers = this.client.newUsers;
    newUsers.set(member.id, member.user);
    // console.info("User Joined!");
    // console.info("currentTime:", currentTime);
    // console.info("nextWelcomeMessageTime:", this.client.nextWelcomeMessageTime);
    // console.log("currentTime",currentTime.toString());
    // console.log("nextWelcomeMessageTime",this.client.nextWelcomeMessageTime.toString());
    if (currentTime.isAfter(this.client.nextWelcomeMessageTime)) {
      // console.log("currentTime is after nextWelcomeMessageTime!");
      const welcomeChannel = member.guild.channels.find(c => c.name === "discord-server-admin");
      // const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);
      let welcomeMessage = `{{member}} joined`;
      let otherMembers;
      // console.log("welcomeChannel",welcomeChannel);
      // console.log("welcomeMessage",welcomeMessage);
      // const latestUser = newUsers.last();
      newUsers.delete(member.id);
      // if (newUsers.size) {
      //   otherMembers = newUsers.map(u => u).join(", ");
      // }

      welcomeMessage = welcomeMessage.replace("{{member}}", member);
      
      // console.log("welcomeMessage",welcomeMessage);
      //if still has other newUsers
      if (newUsers.size > 0) {
        welcomeMessage = `${welcomeMessage} along with`;
        const newUsersArray = newUsers.array();
        newUsersArray.forEach((user, index) => {
          if (index === 0) {
            welcomeMessage = `${welcomeMessage} ${user}`;
          } else {
            if (index === (newUsersArray.length-1)) {
              welcomeMessage = `${welcomeMessage} and ${user}`;
            } else {
              welcomeMessage = `${welcomeMessage}, ${user}`;
            }
          }
        });
      }
      // console.log("welcomeMessage",welcomeMessage);
      welcomeMessage = `*${welcomeMessage}.*`;

      newUsers.clear();
      this.client.nextWelcomeMessageTime = moment().add(this.client.minutesBetweenEachWelcome, 'm');
      welcomeChannel.send(welcomeMessage).catch(console.error);
    }
  
    if (discordMemberRole) {
      if(!member.roles.has(discordMemberRole)) {
        member.roles.add(discordMemberRole).catch(console.error);
      }
    }
    // console.log("NODE_ENV: ",process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    try {
    member.send(`:wave:
Welcome to the Comma.ai Community Discord, ${member}!
I'm Oppey - the community assistant.  

I've added the **Community Member** role for you so you now should have access to all of our standard channels. To get help or request things relating to Discord, reach out to our team in #server-discord-admin.

**Start by checking out our onboarding channels :blue_car:**
\`#welcome\` and \`#getting-started\` can be accessed at any time by clicking the Comma logo on the left and scrolling to the top of the channels list.

**Next, try out some of my new commands. :fire:**
It's important to know that while inside of our Discord channels you have access to an array of new commands that we didn't have on Slack.
The first command most should try is \`-help\`.  I'd probably do that within \`#discord-server-admin\` as to not interupt conversations as much as possible. The help command can display all of the commands available to you from your current location.
Most people like to use the \`-channels\` command to set the vehicle manufacturer they own or are interested in. Doing this will give you access to special extended vehicle support channels.
To see a list of the available roles, type \`-channels\` in the \`#discord-server-admin\` channel.
Then to join/leave a channel group, type \`-channels <name>\`. For example, for Honda type \`-channels honda\`.

**I can also find a lot of useful information for you. :mag_right:** 
Typing one of my many search commands allows you to access different information from the opc.ai website within Discord.
For example, to find those pesky Giraffe dip switch positions by typing something like \`-faq Toyota Giraffe Switches\`.
To find the top video about your vehicle you could type \`-video 2017 Honda Pilot\` or maybe check for any pull requests relating to Jeep by typing \`-pr jeep\`.

There are many more commands available so feel free to check them out with \`-help\`.

Now I'll leave you to it!
Welcome aboard!

:heart: Oppey`, {
  split: true
})
    } catch (e) {
      console.warn("Could not send message... probably a bot.");
    }
  }
};

const moment = require("moment");
const MEMBER_ROLE = require("../constants/member_role");
const { stripIndents } = require('common-tags');

const NICKNAME_CHANGED = "nicknameChanged";
module.exports = async (client, oldMember, newMember) => {
  const modlogChannelId = await client.guilds.first().settings.get('modlog');
  const modlogChannel = await client.guilds.first().channels.find(channel => channel.id === modlogChannelId);
  let actionTaken;
  let oldNickname = oldMember.nickname;
  let newNickname = newMember.nickname;
  
  if (newNickname + "" !== oldNickname + "") {
    actionTaken = NICKNAME_CHANGED;
  }

  if (actionTaken) {

  }
  console.log("User updated...",actionTaken);
  
  switch (actionTaken) {
    case NICKNAME_CHANGED:
    console.log(`Nickname changed from ${oldNickname} to ${newNickname}...`);
  
      let baseYear = 1990;
      const years = Array(baseYear).fill((new Date().getFullYear()+1)-baseYear).map((x, y) => x + y);
     
      let nicknameInvalid = false;
      if (newNickname) {
        years.forEach((year) => {
          if (newNickname.includes(year + " ")) {
            nicknameInvalid = true;
          }
        });
        if (!nicknameInvalid) {
          nicknameInvalid = newNickname.includes("[") || newNickname.includes("]");
        }

        if (nicknameInvalid) {
          newMember.send(stripIndents`:robot: Beep boop beep!
          I've detected a **nickname** change that may **NOT meet community guidelines**.

          Just a reminder, it's no longer necessary to put your vehicle **year, make, model** inside of your nickname and username.
          
          In fact, it's in our community guidelines that you should avoid it in the majority of cases.
          To keep channels and @ mention search clean and concise please use my \`-profile\` feature instead.
          It's also recommended, if you haven't already done so - to add a unique avatar to represent you. It helps people visually pick you out of a list of all of the "David"s and "Alex"s and "John Smith"s.
          
          You can add your vehicle to your profile with \`-add-vehicle year make model trim\` and view your profile with \`-profile\`
          You can view someone elses profile with \`-profile @UserName\``);
        }
      }
      modlogChannel.send(`\`${oldMember.displayName}\` changed nickname from \`${oldMember.displayName}\` to \`${newMember.displayName}\`.`)
    default:
      
  }
};
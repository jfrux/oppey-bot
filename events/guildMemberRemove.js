const MEMBER_ROLE = require("../constants/member_role");
module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (member) {
    if(this.client.newUsers.has(member.id)) this.client.newUsers.delete(member.id);
  }
};

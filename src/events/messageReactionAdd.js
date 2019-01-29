let starredMessages = [];

module.exports = async (client, reaction, user) => {
  return client.menuHandler.handle(reaction, user)
};

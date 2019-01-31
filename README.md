# Oppey Bot

This is the Discord bot that handles helping and assisting users of Openpilot and Comma.ai hardware and ties data from opc.ai into its responses. It also has very few "fun" commands as this isn't that type of Discord server and is focused on discussions around helping getting started and vehicle support.

The command system is now fully based on the latest code in discord.js/Commando.

## Development
We welcome pull requests.

### Getting started
- `yarn` Install Yarn Package Manager. Mac: `brew install yarn` or https://yarnpkg.com/
- `node` Version 11+ recommended but I think you can get away with lower.
  Mac: `brew install yarn` or [https://nodejs.org](https://nodejs.org)

You also need the bot's token. This was created by jfrux in his Discord account. 

`git clone https://github.com/openpilot-community/oppey-bot.git`
`cd oppey-bot`
`yarn install`

You will need to provide your own bot token from the Discord Developer Portal so you can test your Oppey bot changes with your own instance.

Create a `config.js` based on `config.js.example` if it's not too outdated.
You'll also need a killer looking `.env` based on `.env.example`
Hit me up if there are any keys I should share although I probably won't as that's what infosec keeps telling me to NOT do.

To start the bot, run:
`yarn dev`

Follow the *friendly* error messages for info on how to get it running...

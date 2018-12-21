# Oppey Bot

This is the Discord bot that handles helping and assisting users of Openpilot and Comma.ai hardware and ties data from opc.ai into its responses.

Original "Guide Bot" Boilerplate is Updated and Maintained by the Idiot's Guide Community.

This command handler is 98% compatible with [Evie's selfbot](https://github.com/eslachance/evie.selfbot)
and 99% compatible with commands from [York's Tutorial Bot](https://github.com/AnIdiotsGuide/Tutorial-Bot/tree/Episode-10-Part-2).

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win) | [Linux](https://git-scm.com/download/linux) | [MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.0.0 or higher](https://nodejs.org)

You also need the bot's token. This was created by jfrux in his Discord account. 

## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

`git clone https://github.com/openpilot-community/oppey-bot.git`

Once finished:

In the folder from where you ran the git command, run `cd oppey-bot` and then run `npm install`, which will install the required packages,
and it will then run the installer, make sure you have your token at hand to paste into the console.

The installer will create the `config.js` file for you.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

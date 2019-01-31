const scalc = require('scalc');
const commando = require('discord.js-commando');

module.exports = class mathCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'math',
            aliases: ['calc'],
            group: 'util',
            memberName: 'math',
            description: 'Calculate anything',
            examples: ['math {equation to solve}', 'math -10 - abs(-3) + 2^5'],
            guildOnly: false,

            args: [{
                key: 'equation',
                prompt: 'What is the equation to solve?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let toCalc = args.equation;
        msg.delete();
        await msg.say(`\`${toCalc} = ${scalc(toCalc)}\``);
    }
};
const { MessageEmbed } = require("discord.js-light");

module.exports = {
    name: "textblock",
    category: "Fun",
    cooldown: '5',
    description: "Write text with blocks",
    usage: 'textblock <text/number>',
    run(bot, message, args) {
        const blocks = args
            .join(" ")
            .toLowerCase()
            .replace(/[a-z]/g, ":regional_indicator_$&:")
            .replace(/1/g, ":one:")
            .replace(/2/g, ":two:")
            .replace(/3/g, ":three:")
            .replace(/4/g, ":four:")
            .replace(/5/g, ":five:")
            .replace(/6/g, ":six:")
            .replace(/7/g, ":seven:")
            .replace(/8/g, ":eight:")
            .replace(/9/g, ":nine:")
            .replace(/0/g, ":zero:");
        message.channel.send(blocks);
    }
};
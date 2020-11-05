const fetch = require("node-fetch");
const { MessageEmbed } = require('discord.js-light')
module.exports = {
    name: "dadjoke",
    category: "Fun",
    cooldown: '5',
    description: "Shows a dadjoke",
    usage : 'dadjoke',
    async run(bot, message) {
      message.delete()
        const data = await fetch("https://icanhazdadjoke.com/slack").then(res => res.json());
        let e = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor('Dad Jokes')
        .setTitle(data.attachments[0].fallback)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
        message.channel.send(e);
    }
};
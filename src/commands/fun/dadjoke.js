const fetch = require("node-fetch");
const { MessageEmbed } = require('discord.js-light')
module.exports = {
  name: "dadjoke",
  aliases: [""],
  category: "Fun",
  descriptions: "dadjoke Command",
  usage: "dadjoke",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
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
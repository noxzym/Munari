const { MessageEmbed } = require("discord.js-light");
const fetch = require("node-fetch");

module.exports = {
  name: "compliment",
  aliases: ['cpl'],
  category: "Fun",
  cooldown: '5',
  description: "Get a compliment",
  usage:'compliment',
  async run(bot, message) {
    const { compliment } = await fetch(
      "https://complimentr.com/api"
    ).then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("New Compliment")
      .setDescription(compliment)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    message.channel.send(embed);
  },
};
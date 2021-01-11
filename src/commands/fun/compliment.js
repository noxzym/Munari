const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  name: "compliment",
  aliases: null,
  category: "Fun",
  descriptions: "compliment command",
  usage: "compliment",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
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
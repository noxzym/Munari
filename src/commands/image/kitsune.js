const Discord = require("discord.js-light");
const superagent = require("superagent");

module.exports = {
  name: "kitsune",
  aliases: [""],
  category: "Image",
  descriptions: "Give you random a kitsune",
  usage: "kitsune",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  async run(client, message, args) {
      const { body } = await superagent.get("https://neko-love.xyz/api/v1/kitsune");

    const embed = new Discord.MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setTitle(
        `${message.author.username}, this is your Kitsune`
      )
      .setImage(body.url)
      .setTimestamp()
    message.channel.send({ embed });
  }
};

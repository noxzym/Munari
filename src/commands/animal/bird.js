const Discord = require("discord.js-light");
const superagent = require("superagent");

module.exports = {
  name: "bird",
  aliases: [""],
  category: "Animal",
  descriptions: "Give you random a bird picture",
  usage: "bird",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  async run(client, message, args) {
    const { body } = await superagent.get("https://shibe.online/api/birds");

    const e = new Discord.MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setTitle(
        `${message.author.username}, this is your bird picture`
      )
      await e.setImage(body.join(' '))
      .setTimestamp()
    message.channel.send({ embed: e });
  }
};

const Discord = require("discord.js-light");
const superagent = require("superagent");

module.exports = {
  name: "slap",
  aliases: [""],
  category: "Actions",
  descriptions: "Slaps someone",
  usage: "slap <user>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  async run(client, message, args) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if (!member)
      return message.reply("You need to mention someone to hug them");
    const { body } = await superagent.get("https://neko-love.xyz/api/v1/slap");

    const embed = new Discord.MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setTitle(
        `${message.author.username} Slaped ${
          member.user.username
        }`
      )
      .setImage(body.url)
      .setTimestamp()
    message.channel.send({ embed });
  }
};

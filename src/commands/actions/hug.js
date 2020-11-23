const Discord = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "hug",
  aliases: [""],
  category: "Actions",
  descriptions: "hug someone",
  usage: "hug <user>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.reply("You need to mention someone to hug them");
    const { body } = await superagent.get("https://waifu.pics/api/sfw/hug");

    const embed = new Discord.MessageEmbed()
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color
      )
      .setTitle(`${member.user.username} Hugged by ${message.author.username}`)
      .setImage(body.url)
      .setTimestamp();
    message.channel.send({ embed });
  }
};
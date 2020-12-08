const Discord = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "punch",
  aliases: [""],
  category: "Actions",
  descriptions: "Punch someone",
  usage: "punch <user>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.reply("You need to mention someone to punch them");
    if (member.id === client.user.id) return message.channel.send(`I don't want it`)
    const { body } = await superagent.get("https://neko-love.xyz/api/v1/punch");

    const embed = new Discord.MessageEmbed()
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color
      )
      .setTitle(`${member.user.username} Punched by ${message.author.username}`)
      .setImage(body.url)
      .setTimestamp();
    message.channel.send({ embed });
  }
};

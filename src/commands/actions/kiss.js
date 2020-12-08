const { MessageAttachment, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "kiss",
  aliases: [""],
  category: "Actions",
  descriptions: "Kiss someone",
  usage: "kiss <user>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.reply("You need to mention someone to kiss them");
    if (member.id === client.user.id) return message.channel.send(`I don't want it`)
    const { body } = await superagent.get("https://nekos.life/api/v2/img/kiss");
    const get = body.url
    const ath = new MessageAttachment(get, 'kiss.gif')
    const e = new MessageEmbed()
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color
      )
      .setTitle(`${member.user.username} Kissed by ${message.author.username}`)
      .setImage('attachment://kiss.gif')
      .setTimestamp();
    message.channel.send({ files: [ath], embed: e });
  }
};
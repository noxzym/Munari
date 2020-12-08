const { MessageAttachment, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "pat",
  aliases: [""],
  category: "Actions",
  descriptions: "Patting someone",
  usage: "pat <user>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.reply("You need to mention someone to pat them");
    if (member.id === client.user.id) return message.channel.send(`I don't want it`)
    const { body } = await superagent.get("https://nekos.life/api/v2/img/pat");
    const get = body.url
    const ath = new MessageAttachment(get, 'pat.gif')
    const e = new MessageEmbed()
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color
      )
      .setTitle(`${member.user.username} Pated by ${message.author.username}`)
      .setImage('attachment://pat.gif')
      .setTimestamp();
    message.channel.send({ files: [ath], embed: e });
  }
};
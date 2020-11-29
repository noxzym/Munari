const { MessageAttachment, MessageEmbed } = require("discord.js");
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
    if (member.id === client.user.id) return message.channel.send(`I don't want it`)
    if (!member)
      return message.reply("You need to mention someone to hug them");
    const { body } = await superagent.get("https://nekos.life/api/v2/img/hug");
    const get = body.url
    const ath = new MessageAttachment(get, 'hug.gif')
    const e = new MessageEmbed()
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color
      )
      .setTitle(`${member.user.username} Hugged by ${message.author.username}`)
      .setImage('attachment://hug.gif')
      .setTimestamp();
    message.channel.send({ files: [ath], embed: e });
  }
};
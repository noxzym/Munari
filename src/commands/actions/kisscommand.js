const { MessageAttachment, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "kiss",
  aliases: null,
  category: "Actions",
  descriptions: "Kiss your crush",
  usage: "kiss <user>",
  options: null,
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const member = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) || message.mentions.members.first()
    if (!member) return message.reply("You need to mention someone for you kiss").then(msg => { msg.delete({ timeout: 10000 }) });
    if (member.id === client.user.id) return message.channel.send(`I don't want it`).then(msg => { msg.delete({ timeout: 10000 }) });

    const { url } = await fetch("https://nekos.life/api/v2/img/kiss").then(x => x.json());
    const ath = new MessageAttachment(url, 'kiss.gif')

    const e = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle(`${member.user.username} has been Kissed by ${message.author.username}`)
      .setImage('attachment://kiss.gif')
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
    message.channel.send({ files: [ath], embed: e });
  }
};
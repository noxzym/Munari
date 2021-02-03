const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "bully",
  aliases: null,
  category: "Actions",
  descriptions: "Bully yout crush",
  usage: "bully <user>",
  options: null,
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const member = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) || message.mentions.members.first()
    if (!member) return message.reply("You need to mention someone for you bully").then(msg => { msg.delete({ timeout: 10000 }) });
    if (member.id === client.user.id) return message.channel.send(`I don't want it`).then(msg => { msg.delete({ timeout: 10000 }) });

    const { url } = await fetch("https://waifu.pics/api/sfw/bully").then(x => x.json());
    let ath = new Discord.MessageAttachment(url, "bully.gif");
    const e = new Discord.MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle(`${member.user.username} has been Bullied by ${message.author.username}`)
      .setImage("attachment://bully.gif")
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
    message.channel.send({ embed: e, files: [ath] });
  }
};
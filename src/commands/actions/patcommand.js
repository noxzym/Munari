const { MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
  name: "pat",
  aliases: null,
  category: "Actions",
  descriptions: "Head pat your crush",
  usage: "pat <user>",
  options: null,
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const member = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) || message.mentions.members.first()
    if (!member) return message.reply("You need to mention someone for you pat").then(msg => { msg.delete({ timeout: 10000 }) });
    if (member.id === client.user.id) return message.channel.send(`I don't want it`).then(msg => { msg.delete({ timeout: 10000 }) });

    const { url } = await fetch("https://nekos.life/api/v2/img/pat").then(x => x.json())
    const ath = new MessageAttachment(url, 'pat.gif')

    const e = createEmbed("info")
      .setTitle(`${member.user.username} has been Patted by ${message.author.username}`)
      .setImage('attachment://pat.gif')
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
    message.channel.send({ files: [ath], embed: e });
  }
};
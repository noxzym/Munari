const Discord = require("discord.js");
module.exports = {
  name: "ping",
  aliases: null,
  category: "Utility",
  descriptions: "to give latency and websocket ping",
  usage: "ping",
  options: null,
  cooldown: "1",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(bot, message, args) {
    let latency = Math.round(new Date() - message.createdTimestamp)
    let websocket = bot.ws.ping
    let ping = new Discord.MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTimestamp(message.createdTimestamp)
      .setDescription(`:ping_pong: **Pong! \n\`📶\`Latency = **\`${latency}\`** ms\n\`🖥️\`Websocket = **\`${websocket}\`** ms**`)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp()
    message.channel.send(ping)
  }
}
const { createEmbed } = require("../../utils/createEmbed");

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
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(bot, message, args) {
    let latency = Math.round(new Date() - message.createdTimestamp)
    let websocket = bot.ws.ping
    
    let ping = createEmbed("info")
      .setTimestamp(message.createdTimestamp)
      .setDescription(`:ping_pong: **Pong! \n\`📶\`Latency = **\`${latency}\`** ms\n\`🖥️\`Websocket = **\`${websocket}\`** ms**`)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
    message.channel.send(ping)
  }
}
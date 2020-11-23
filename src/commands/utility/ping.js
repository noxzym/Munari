  const Discord = require("discord.js");
module.exports = {
  name: "ping",
  aliases: [""],
  category: "Utility",
  descriptions: "to give latency and websocket ping",
  usage: "ping",
  options: [""],
  cooldown: "1",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
  let mentionedUser = message.mentions.users.first() || message.author;
  let latency = Math.round(new Date() - message.createdTimestamp)
  let websocket = bot.ws.ping
  let ping = new Discord.MessageEmbed()
  .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
  .setTimestamp(message.createdTimestamp)
  .setDescription(`:ping_pong: **Pong! \n\`📶\`Latency = **\`${latency}\`** ms\n\`🖥️\`Websocket = **\`${websocket}\`** ms**`)
  .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
  .setTimestamp()
  message.channel.send(ping).then(msg => {msg.delete({  timeout: 20000  })})
}
  }
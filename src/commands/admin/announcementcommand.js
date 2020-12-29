const Discord = require('discord.js')
module.exports = {
  name: "announcement",
  aliases: ["anc"],
  category: "Administration",
  descriptions: "Send Announcement message to specific channel",
  usage: "announcement <#channel> <json embed>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_MESSAGES")) return message.channel.send(`You don't have permissions \`ADMINISTRATOR\``);

    let data;
    try {
      data = JSON.parse(args.slice(1).join(' ').toString())
    } catch (e) {
      return message.channel.send({ embed: { color: 'ff0000', description: `Please input like **[\`this\`](https://raw.githubusercontent.com/BlazeDexX/blazedexx.github.io/master/index.html)**` } }).then(x => { x.delete({ timeout: 10000 }) })
    }

    let channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first()
    if (!channel) return message.channel.send(`Please input channel first`)
    channel.send({
      embed: data
    });
  }
}
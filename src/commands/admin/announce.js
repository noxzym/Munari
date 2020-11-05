const Discord = require('discord.js-light')
const Prefix = require('discord-prefix')
module.exports = {
  name: "announcement",
  aliases: ["anc"],
  category: "Administration",
  descriptions: "Send Announcement message to specific channel",
  usage: "announcement <channel> [Title]<,.>[Description]<,.>[Image]",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  async run(client, message, args) {
  const prefix = Prefix.getPrefix(message.guild.id) || 'm!'
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`You don't have permissions \`ADMINISTRATOR\``);
    let rest = args.slice(1).join(' ')
    if(!rest) return message.channel.send(`Usage: ${prefix + this.usage}`)
    let array_of_arguments = rest.split(',.')
    let embed = new Discord.MessageEmbed()
      .setTitle(array_of_arguments[0])
      .setDescription(array_of_arguments[1])
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color)
      .setImage(array_of_arguments[2] || null)
  //    .setThumbnail(message.guild.iconURL({  dynamic: true, size : 512  }))
      .setFooter(`Announce Message by: ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
      .setTimestamp();
    let channel = message.mentions.channels.first()
    if(!channel) return message.channel.send(`Please input channel first`)
    channel.send({ embed });
    message.delete()
  }
}
const Discord = require('discord.js')
module.exports = {
  name: "announcement",
  aliases: ["anc"],
  category: "Administration",
  descriptions: "Send Announcement message to specific channel",
  usage: "announcement <channel> [Title]<,.>[Description]<,.>[Image]",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const prefix = 'm!'
    if (!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_MESSAGES")) return message.channel.send(`You don't have permissions \`ADMINISTRATOR\``);
    let rest = args.slice(1).join(' ')
    if (!rest) return message.channel.send(`Usage: ${prefix + this.usage}`)
    let array_of_arguments = rest.split(',.')
    let embed = new Discord.MessageEmbed()
      .setTitle(array_of_arguments[0])
      .setDescription(array_of_arguments[1])
      .setColor(message.member.displayHexColor)
      .setImage(array_of_arguments[2] || null)
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter(`Announce Message by: ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp();
    let channel = message.mentions.channels.first()
    if (!channel) return message.channel.send(`Please input channel first`)
    channel.send({ embed });
  }
}
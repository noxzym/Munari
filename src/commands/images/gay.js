const { MessageEmbed, MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
  name: "gay",
  aliases: [""],
  category: "Image",
  descriptions: "Add gay filter to avatar",
  usage: "gay [user]",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { image } = new alex(client.config.alexapi)

    const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

    const img = await image.gay({ image: `${member.user.avatarURL({ dynamic: false, size: 4096, format: 'png' })}` })

    let ath = new MessageAttachment(img, "gay.png")
    var fetchmsg = await message.channel.send(`Fetching Image <a:LoadingFetch:785715659727175731>`)

    let e = new MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setTitle(member.user.tag)
      .setImage('attachment://gay.png')
      .setTimestamp()
    message.channel.send({ files: [ath], embed: e })
    fetchmsg.delete()
  }
}
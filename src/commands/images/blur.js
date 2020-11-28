const {MessageEmbed, MessageAttachment} = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
  name: "blur",
  aliases: [""],
  category: "Image",
  descriptions: "Make avatar blur",
  usage: "blur [user]",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { image } = new alex(client.config.alexapi)

    const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

    const img = await image.blur({ image: `${member.user.avatarURL({ dynamic: false, size: 4096, format: 'png' })}` })

    let ath = new MessageAttachment(img, "blur.png")
    
    let e = new MessageEmbed()
    .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
    .setTitle(member.user.tag)
    .setImage('attachment://blur.png')
    .setTimestamp()
    message.channel.send({ files: [ath], embed: e })
  }
}
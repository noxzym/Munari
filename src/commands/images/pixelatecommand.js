const { MessageEmbed, MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
const { image } = new alex('93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb')
module.exports = {
  name: "pixel",
  aliases: [""],
  category: "Image",
  descriptions: "Make avatar picture to pixelate",
  usage: "pixel [user]",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { image } = new alex(client.config.alexapi)

    const member =
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
      message.mentions.members.first() ||
      message.member
    const img = await image.pixelate({ image: `${member.user.avatarURL({ dynamic: false, size: 4096, format: 'png' })}` })

    let ath = new MessageAttachment(img, "pixelate.png")
    var fetchmsg = await message.channel.send(`Fetching Image <a:LoadingFetch:785715659727175731>`)

    let e = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle(member.user.tag)
      .setImage('attachment://pixelate.png')
      .setTimestamp()
    message.channel.send({ files: [ath], embed: e })
    fetchmsg.delete()
  }
}
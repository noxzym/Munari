const { MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
  name: "",
  aliases: [""],
  category: "",
  descriptions: "",
  usage: "",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { image } = new alex(client.config.alexapi)
    const input = args[0];
    if(!input) return message.channel.send(`Please input some case`)
    if(input.length > 20) return message.channel.send(`You provide text oversize`)

    let img = await image.achievement({ text: `${input}` })
    let ath = new MessageAttachment(img, "achievement.png")

    message.channel.send(ath)
  }
}
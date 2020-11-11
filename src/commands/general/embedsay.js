const { MessageEmbed } = require('discord.js-light')
module.exports = {
  name: "embedsay",
  aliases: [""],
  category: "General",
  descriptions: "say command with embed",
  usage: "embedsay [text]",
  options: [""],
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
  const prefix = 'm!'
  message.delete()
    const content = args.join(' ')
    if(!content) {
      return message.channel.send(`${prefix + this.usage}`)
    }
    const contentinput = content.split(',.')
    const e = new MessageEmbed()
    .setDescription(contentinput[0])
    .setColor('#0099ff')
    .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    message.channel.send(e)
  }
}
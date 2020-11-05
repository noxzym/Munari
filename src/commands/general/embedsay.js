const PREFIX = require('discord-prefix')
const { MessageEmbed } = require('discord.js-light')
module.exports = {
  name: 'embedsay',
  aliases: ['embsay'],
  category: 'General',
  cooldown: '10',
  usage: 'embedsay [message]',
  async run (client, message, args) {
  const prefix = PREFIX.getPrefix(message.guild.id) || 'm!'
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
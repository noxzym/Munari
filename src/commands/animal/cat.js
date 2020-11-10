const Discord = require('discord.js-light')
const request = require('request')

module.exports = {
  name: 'cat',
  category: 'Animal',
  cooldown: '5',
  usage:'cat',
async run(bot, message, args) {  
  request('http://aws.random.cat/meow', function (error, body) {
    var result = JSON.parse(body.body)
    const embed = new Discord.MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setImage(result.file)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    message.channel.send(embed)
  })
}}
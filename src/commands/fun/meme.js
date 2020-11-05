const Discord = require('discord.js-light')
const randomPuppy = require('random-puppy')
module.exports = {
  name: 'meme',
  category: 'Fun',
  cooldown: '5',
async run(bot, message, args) {
  const subReddits = ['dankmeme', 'meme', 'memes', 'spicy_memes', 'me_irl']
  const random = subReddits[Math.floor(Math.random() * subReddits.length)]

  const img = await randomPuppy(random)
  const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setImage(img)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))

  message.channel.send(embed)
}}
const Discord = require('discord.js-light')
const joke = require('one-liner-joke').getRandomJoke

module.exports = {
  name: 'joke',
  category: 'Fun',
  cooldown: '5',
  usage:'joke',
async run(bot, message, args) {
  
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription(joke({ exclude_tags: ['dirty', 'racist', 'marriage', 'sex', 'death'] }).body)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    )
}}
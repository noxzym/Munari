const Discord = require('discord.js')
const joke = require('one-liner-joke').getRandomJoke
module.exports = {
  name: "joke",
  aliases: [""],
  category: "Fun",
  descriptions: "Generate joke",
  usage: "joke",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {

    message.channel.send(
      new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription(joke({ exclude_tags: ['dirty', 'racist', 'marriage', 'sex', 'death'] }).body)
        .setTimestamp()
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
    )
  }
}
const { MessageEmbed } = require('discord.js')
module.exports = {
  name: "iq",
  aliases: [""],
  category: "Actions",
  descriptions: "Gacha Iq",
  usage: "iq [user]",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
    async run (client, message, args) {
    const iq = Math.floor(Math.random() * 200) + 1;
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    if(!member) {
      message.channel.send(`Hold a moment <a:loading1:753610786991112282>`)
      .then(msg => {
      setTimeout(function() {
      msg.edit(`${message.author} have ${iq} IQ`)
      }, 5000)
    })
    }
    if(member) {
      message.channel.send(`Hold a moment <a:loading1:753610786991112282>`)
      .then(msg => {
      setTimeout(function() {
      msg.edit(`${member} have ${iq} IQ`)
      }, 5000)
    })
    }
  }
}
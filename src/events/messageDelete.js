const db = require('quick.db')
const Discord = require('discord.js-light')
module.exports = {
  name: 'messageDelete',
  async run (client, message) {
  let chx = db.get(`messagedel_${message.guild.id}`);
    if( chx === null ) {
      return;
    }
  let delembed = new Discord.MessageEmbed()
  .setColor('BLUE')
  .setAuthor(`${message.author.tag}, Has Been Deleted Message`)
  .setDescription(`**Message Send by ${message.author} in Channel ${message.channel} Has been Deleted**\n❱ ${message.content}`)
  .setTimestamp()
  .setFooter("Takagi Message logs", message.guild.iconURL);
  let channel = message.guild.channels.cache.get(chx)
  channel.send(delembed)
  }
}
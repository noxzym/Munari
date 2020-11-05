const Discord = require("discord.js-light");
const prefix = require('discord-prefix');
const defpref = require('../../../src/data/config.json').prefix
module.exports = {
  name: "prefix",
  aliases: [""],
  category: "Administration",
  descriptions: "Make custem prefix per guild by user",
  usage: "prefix <prefix>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  async run(bot, message, args) {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`You don't have permissions \`ADMINISTRATOR\``);
    
    if(!args[0]) {
      return message.channel.send('Please input new prefix')
    }
    if(args[0] === defpref) {
      return message.channel.send('Please input diferent prefix from the default')
    }
    if(args[1]) {
      return message.channel.send(`Sorry, you can't input double prefix`)
    }
    if(args.leght > 3) {
      return message.channel.send(`Sorry,  new prefix can't exceed 3 character`)
    }
    if(prefix.getPrefix(message.guild.id) === defpref) {
      return message.channel.send('Please input the prefix at this time to reset the prefix to default')
    }
    
      if(args.join('') === prefix.getPrefix(message.guild.id)) {
      prefix.removePrefix(message.guild.id)
      message.channel.send(`Prefix has change to default`)
      } else {
        prefix.setPrefix(args[0], message.guild.id)
        message.channel.send(`Prefix has changed to ${prefix.getPrefix(message.guild.id)}`)
      }
	    
}}
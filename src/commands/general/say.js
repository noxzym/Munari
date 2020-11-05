const Discord = require('discord.js-light')
module.exports = {
  name: "say",
  aliases: [""],
  category: "General",
  descriptions: "",
  usage: "say [message]",
  options: [""],
  cooldown: "10",
  ownerOnly: false,
  async run(client, message, args) {
  message.delete()
    const sayMessage = args.join(" ");    
    if(!sayMessage) return;
    message.channel.send(sayMessage);



}}
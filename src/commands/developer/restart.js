const Discord = require('discord.js')
module.exports = {
  name: "restart",
  aliases: null,
  category: "Developer",
  descriptions: "",
  usage: "restart",
  options: null,
  cooldown: "",
  ownerOnly: true,
  async run(client, message, args) {
    message.channel.send(`Restarting Bot...`)
    .then(msg => {msg.delete({timeout:3000})})
      .then(client.destroy())
      .then(client.login('NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4'))
  message.delete();
}}
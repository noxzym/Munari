const Discord = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "fact",
  aliases: null,
  category: "Fun",
  descriptions: "fact command",
  usage: "fact",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { body } = await superagent.get("https://nekos.life/api/v2/fact");
    message.channel.send(`**${body.fact}**`)
  }
};

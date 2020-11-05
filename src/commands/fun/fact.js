const Discord = require("discord.js-light");
const superagent = require("superagent");

module.exports = {
  name: "fact",
  aliases: [""],
  category: "Fun",
  descriptions: "Give you random fact",
  usage: "fact",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  async run(client, message, args) {
    const { body } = await superagent.get("https://nekos.life/api/v2/fact");
    message.channel.send(`**${body.fact}**`)
  }
};

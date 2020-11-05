const Discord = require("discord.js-light");
const superagent = require("superagent");

module.exports = {
  name: "randomname",
  aliases: ["name"],
  category: "Fun",
  descriptions: "Give you random name",
  usage: "randomname",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  async run(client, message, args) {
    const { body } = await superagent.get("https://nekos.life/api/v2/name");
    message.reply(`Your name is **\`${body.name}\`**`)
  }
};

const Discord = require("discord.js-light");
const superagent = require("superagent");

module.exports = {
  name: "owoify",
  aliases: [""],
  category: "Fun",
  descriptions: "",
  usage: "owoify <text>",
  options: [""],
  cooldown: "10",
  ownerOnly: false,
  async run(client, message, args) {
    if (!args[0]) return message.channel.send(`Please input some case or text`);
    const { body } = await superagent.get(`https://nekos.life/api/v2/owoify?text=${args[0]}`);
    message.channel.send(`${body.owo}`);
  }
}
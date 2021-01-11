const Discord = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "8ball",
  aliases: null,
  category: "Fun",
  descriptions: "",
  usage: "8ball [text]",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    if (!args[0]) return message.channel.send(`Please input some case or text`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (args.length < 2)
      return message.channel.send(`Please input text minimal 2 word`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    const { body } = await superagent.get("https://nekos.life/api/v2/8ball");
    message.channel.send(`${body.response}`);
  }
};

const fetch = require("node-fetch");

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
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const { fact } = await fetch("https://nekos.life/api/v2/fact").then(x => x.json())
    message.channel.send(`**${fact}**`)
  }
};

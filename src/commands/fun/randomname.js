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
    try {
    message.member.setNickname(`${body.name}`)
    .then(x => x.channel.send(`Your name has change to **\`${body.name}\`**`))
    .then(z => {x.delete({timeout: 6000})})
  } catch (e) {
    message.channel.send(`I can't to change nickname because Missing Permissions of **\`MANAGE_NICKNAMES\`**`)
  }
  }
};

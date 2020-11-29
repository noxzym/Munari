const { MessageAttachment, MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "poke",
  aliases: [""],
  category: "Actions",
  descriptions: "poke someone",
  usage: "poke <user>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if (member.id === client.user.id) return message.channel.send(`I don't want it`)
    if (!member)
      return message.reply("You need to mention someone to poke them");
    const { body } = await superagent.get("https://nekos.life/api/v2/img/poke");
    const get = body.url
    const ath = new MessageAttachment(get, 'poke.gif')
    const e = new MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setTitle(
        `${message.author.username} Poke ${
          member.user.username
        }`
      )
      .setImage('attachment://poke.gif')
      .setTimestamp()
    message.channel.send({ files: [ath], embed: e });
  }
};

const { MessageAttachment, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "hug",
  aliases: null,
  category: "Actions",
  descriptions: "hug someone",
  usage: "hug <user>",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const member =
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || 
      x.user.username === `${args[0]}`) ||
      message.mentions.members.first()
    if (!member)
      return message.reply("You need to mention someone to hug them").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (member.id === client.user.id) return message.channel.send(`I don't want it`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    const { body } = await superagent.get("https://nekos.life/api/v2/img/hug");
    const get = body.url
    const ath = new MessageAttachment(get, 'hug.gif')
    const e = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle(`${member.user.username} Hugged by ${message.author.username}`)
      .setImage('attachment://hug.gif')
      .setTimestamp();
    message.channel.send({ files: [ath], embed: e });
  }
};
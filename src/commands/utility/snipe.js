const { MessageEmbed } = require('discord.js-light')
module.exports = {
  name: "snipe",
  aliases: [""],
  category: "Utility",
  descriptions: "get last message delete",
  usage: "snipe [channel]",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let channel = message.mentions.channels.first()
    if(channel) {
      const snipes = client.snipes.get(channel.id) || [];
      const msg = snipes[args[0] - 1 || 0];
      if (!msg) return message.channel.send(`Nothing delete in this channel`);
      const Embed = new MessageEmbed()
       .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
       .setAuthor(msg.author.tag)
       .setThumbnail(msg.author.avatarURL({dynamic: true}))
       .setDescription(msg.content)
       .setFooter(`Date: ${msg.date} | ${args[0] || 1}/${snipes.length}`);
      if (msg.attachment) Embed.setImage(msg.attachment);
    message.channel.send(Embed);
    } else {
      const snipes = client.snipes.get(message.channel.id) || [];
      const msg = snipes[args[0] - 1 || 0];
      if (!msg) return message.channel.send(`Nothing delete in this channel`);
      const Embed = new MessageEmbed()
       .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
       .setAuthor(msg.author.tag)
       .setThumbnail(msg.author.avatarURL({dynamic: true}))
       .setDescription(msg.content)
       .setFooter(`Date: ${msg.date} | ${args[0] || 1}/${snipes.length}`);
      if (msg.attachment) Embed.setImage(msg.attachment);
    message.channel.send(Embed);
  }
  }
}
const Discord = require("discord.js-light");

module.exports = {
  name: "color",
  aliases: [""],
  category: "General",
  descriptions: "Show you color of hexcolor code",
  usage: "color [hexcode]",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const color = args[0] || 'RANDOM';
    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`Hex Color: ` + color)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    message.channel.send(embed);
}}
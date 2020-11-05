const Discord = require("discord.js-light");

module.exports = {
  name: 'color',
  category: 'General',
  cooldown: '5',
  usgae:'color <HexColor>',
  
  async run(bot, message, args) {
    const color = args[0] || 'RANDOM';
    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`Hex Color: ` + color)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    message.channel.send(embed);
}}
module.exports = {
  name: "",
  aliases: [""],
  category: "",
  descriptions: "",
  usage: "",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    
  }
}


const { MessageEmbed } = require('discord.js-light')

module.exports = {
    name: "",
    aliases: [""],
    category: "",
    descriptions: "",
    usage: "",
    options: [""],
    cooldown: "",
    ownerOnly: false,
    async run(client, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member)
            return message.reply("You need to mention someone to kiss them");

        let gif = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ];
        let selected = gif[Math.floor(Math.random() * gif.length)];

        const embed = new MessageEmbed()
            .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
            .setTitle(
                `${message.author.username} <action> ${member.user.username
                }`
            )
            .setImage(`https://media.giphy.com/media/${selected}/giphy.gif`)
            .setTimestamp()
        message.channel.send({ embed });
    }
}
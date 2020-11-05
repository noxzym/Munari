const { MessageEmbed } = require('discord.js-light')

module.exports = {
    name: "pat",
    aliases: [""],
    category: "Actions",
    descriptions: "pat someone",
    usage: "pat <user> ",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    async run(client, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member)
            return message.reply("You need to mention someone to kiss them");

        let gif = [
            "ye7OTQgwmVuVy",
            "4HP0ddZnNVvKU",
            "L2z7dnOduqEow",
            "SSPW60F2Uul8OyRvQ0",
            "osYdfUptPqV0s",
            "5tmRHwTlHAA9WkVxTU",
            "109ltuoSQT212w",
            "e7xQm1dtF9Zni",
            "Z7x24IHBcmV7W",
            "3oz8xDLT82QiURnPS8",
        ];
        let selected = gif[Math.floor(Math.random() * gif.length)];

        const embed = new MessageEmbed()
            .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
            .setTitle(
                `${message.author.username} Head Patting ${member.user.username
                }`
            )
            .setImage(`https://media.giphy.com/media/${selected}/giphy.gif`)
            .setTimestamp()
        message.channel.send({ embed });
    }
}
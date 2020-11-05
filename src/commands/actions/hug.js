const { MessageEmbed } = require('discord.js-light')
module.exports = {
    name: "hug",
    aliases: [""],
    category: "Actions",
    descriptions: "Hug someone",
    usage: "hug <user>",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    async run(client, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member)
            return message.reply("You need to mention someone to hug them");

        let gif = [
            "IRUb7GTCaPU8E",
            "u9BxQbM5bxvwY",
            "3EJsCqoEiq6n6",
            "GcJN2Dz5XMDeM",
            "5eyhBKLvYhafu",
            "3bqtLDeiDtwhq",
            "49mdjsMrH7oze",
            "ArLxZ4PebH2Ug",
            "sUIZWMnfd4Mb6",
            "DjczAlIcyK1Co",
        ];
        let selected = gif[Math.floor(Math.random() * gif.length)];

        const embed = new MessageEmbed()
            .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
            .setTitle(
                `${message.author.username} Hugged ${member.user.username
                }`
            )
            .setImage(`https://media.giphy.com/media/${selected}/giphy.gif`)
            .setTimestamp()
        message.channel.send({ embed });
    }
}
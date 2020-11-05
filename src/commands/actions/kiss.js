const Discord = require("discord.js-light");
module.exports = {
    name: "kiss",
    aliases: [""],
    category: "Actions",
    descriptions: "kiss someone",
    usage: "kiss <user>",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    async run(client, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member)
            return message.reply("You need to mention someone to kiss them");

        let gif = [
            "bm2O3nXTcKJeU",
            "nyGFcsP0kAobm",
            "ofF5ftkB75n2",
            "bGm9FuBCGg4SY",
            "dP8ONh1mN8YWQ",
            "U9lRsXbwlbL4k",
            "IdzovcoOUoUM0",
            "GNJNcvuB1nWKY",
            "wOtkVwroA6yzK",
            "zkppEMFvRX5FC",
        ];
        let selected = gif[Math.floor(Math.random() * gif.length)];

        const embed = new Discord.MessageEmbed()
            .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
            .setTitle(
                `${message.author.username} Kiss ${member.user.username
                }`
            )
            .setImage(`https://media.giphy.com/media/${selected}/giphy.gif`)
            .setTimestamp()
        message.channel.send({ embed });
    }
};

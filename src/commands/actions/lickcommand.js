const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "lick",
    aliases: null,
    category: "Actions",
    descriptions: "Lick your crush",
    usage: "lick <user>",
    options: null,
    cooldown: "10",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) || message.mentions.members.first()
        if (!member)return message.reply("You need to mention someone for you lick").then(msg => { msg.delete({ timeout: 10000 }) });
        if (member.id === client.user.id) return message.channel.send(`I don't want it`).then(msg => { msg.delete({ timeout: 10000 }) });

        const { url } = await fetch("https://waifu.pics/api/sfw/lick").then(x => x.json());
        const ath = new Discord.MessageAttachment(url, "lick.gif");

        const e = new Discord.MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle(`${member.user.username} has been Licked by ${message.author.username}`)
            .setImage("attachment://lick.gif")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ embed: e, files: [ath] });
    }
};
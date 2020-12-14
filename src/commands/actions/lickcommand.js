const Discord = require("discord.js");
const superagent = require("superagent");
module.exports = {
    name: "lick",
    aliases: [""],
    category: "Actions",
    descriptions: "Licked someone",
    usage: "lick <user>",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member =
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
            message.mentions.members.first()
        if (!member)
            return message.reply("You need to mention someone to Lick them");
        if (member.id === client.user.id) return message.channel.send(`I don't want it`)
        const { body } = await superagent.get("https://waifu.pics/api/sfw/lick");

        const embed = new Discord.MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle(`${message.author.username} Licked ${member.user.username}`)
            .setImage(body.url)
            .setTimestamp();
        message.channel.send({ embed });
    }
};
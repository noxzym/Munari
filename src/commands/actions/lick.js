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
        let member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);
        if (member.id === client.user.id) return message.channel.send(`I don't want it`)
        if (!member)
            return message.reply("You need to mention someone to Lick them");
        const { body } = await superagent.get("https://waifu.pics/api/sfw/lick");

        const embed = new Discord.MessageEmbed()
            .setColor(
                message.member.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .first().color
            )
            .setTitle(`${message.author.username} Licked ${member.user.username}`)
            .setImage(body.url)
            .setTimestamp();
        message.channel.send({ embed });
    }
};
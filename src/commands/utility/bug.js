const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "bug",
    aliases: ["error"],
    category: "",
    descriptions: "Report to developer about bug or error command",
    usage: "bug <commands> <descriptiom>",
    options: [""],
    cooldown: "120",
    ownerOnly: true,
    async run(client, message, args) {
        let e = new MessageEmbed()
        .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
        .setThumbnail(message.author.avatarURL({dynamic: true}))
        await message.guild.channels.cache.get(message.author.lastMessageChannelID).createInvite().then(x => e.setDescription(`[Invite](https://discord.gg/${x.code})`))
        const guild = client.guilds.cache.get('770540956163899423').channels.cache.get('773853948359737357')
        guild.send({embed: e})
    }
}
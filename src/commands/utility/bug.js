const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "bug",
    aliases: ["error"],
    category: "Utility",
    descriptions: "Report to developer about bug or error command",
    usage: "bug <commands> <descriptiom>",
    options: [""],
    cooldown: "120",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        let input = args.join(' ')
        if(!input) return message.channel.send(`Please input your problem`).then(x => {x.delete({timeout: 8000})})
        if(input.length > 120) return message.channel.send(`Promblem description must < 120 word`)

        const sname = message.guild.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')

        let e = new MessageEmbed()
        .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
        .setThumbnail(message.author.avatarURL({dynamic: true}))
        .setTitle(`Report Command`)
        .setTimestamp()
        await message.guild.channels.cache.get(message.author.lastMessageChannelID).createInvite().then(x => e.setDescription(`**Report command from \`${message.author.tag} • ${message.author.id}\` • [\`INVITE\`](https://discord.gg/${x.code})\nProblem Description\n\`\`\`asciidoc\n${input}\n\`\`\`**`))
        const guild = client.guilds.cache.get('770540956163899423').channels.cache.get('773853948359737357')
        guild.send({embed: e})

        let channel = new MessageEmbed()
        .setTitle(`Report to developer successful!`)
        .setDescription(`**Problem Description: \n\`\`\`asciidoc\n${input}\n\`\`\`**`)
        message.channel.send(channel)
    }
}
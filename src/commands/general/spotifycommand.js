const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "spotify",
    aliases: [""],
    category: "General",
    descriptions: "Display spotify user",
    usage: "spotify [member<mention/id>]",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

        const presence = member.presence.activities.filter(x => x.name === 'Spotify')[0]
        if (!presence) return message.channel.send(`I can't find spotify presence, try again`)

        const album = presence.assets.largeText
        const img = `https://i.scdn.co/image/${presence.assets.largeImage.slice(8)}`
        const url = `https://open.presenceify.com/track/${presence.syncID}`
        const songname = presence.details
        const title = `${presence.state} • ${presence.details}`
        const auth = presence.state
        let e = new MessageEmbed()
            .setColor('18d869 ')
            .setAuthor(`Spotify Song Information`, 'https://media.discordapp.net/attachments/570740974725103636/582005158632882176/Spotify.png')
            .setTitle(`${title}`)
            .setURL(url)
            .setDescription(`\`\`\`asciidoc\n• SongName   :: ${songname}\n• SongAlbum  :: ${album}\n• SongAuthor :: ${auth}\n\`\`\``)
            .setThumbnail(`${img}`)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send(e)
    }
}
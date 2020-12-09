const { MessageEmbed, MessageAttachment } = require('discord.js')
const { Spotify } = require('canvacord')
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

        const songname = presence.details
        const album = presence.assets.largeText
        const canvatitle = presence.details
        const title = `${presence.state} • ${presence.details}`
        const url = `https://open.spotify.com/track/${presence.syncID}`
        const img = `https://i.scdn.co/image/${presence.assets.largeImage.slice(8)}`
        const auth = presence.state

        const start = presence.timestamps.start
        const end = presence.timestamps.end

        if (message.content.includes('--card')) {
            const spotify = new Spotify()
                .setAuthor(auth)
                .setTitle(canvatitle)
                .setImage(img)
                .setAlbum(album)
                .setStartTimestamp(start)
                .setEndTimestamp(end)
            const buffer = await spotify.build()
            const ath = new MessageAttachment(buffer, 'Spotify.png')
            message.channel.send(member, ath)
        } else {
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
}
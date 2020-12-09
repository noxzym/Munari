const { MessageEmbed, MessageAttachment } = require('discord.js')
const { registerFont, createCanvas, loadImage } = require('canvas')
module.exports = {
    name: "spotify",
    aliases: [""],
    category: "General",
    descriptions: "Display spotify user",
    usage: "spotify [member<mention/id>]",
    options: ["--card"],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

        const presence = member.presence.activities.filter(x => x.name === 'Spotify')[0]
        if (!presence) return message.channel.send(`I can't find spotify presence, try again`)
        
        const songname = presence.details.length > 15 ? presence.details.replace(presence.details.substr(15, 1000), " ...") : presence.details
        const album = presence.assets.largeText.length > 18 ? presence.assets.largeText.replace(presence.assets.largeText.substr(18, 1000), " ...") : presence.assets.largeText
        const auth = presence.state.length > 20 ? presence.state.replace(presence.state.substr(20, 1000), ' ...') : presence.state
        const title = `${presence.state} • ${presence.details}`
        const url = `https://open.spotify.com/track/${presence.syncID}`
        const img = `https://i.scdn.co/image/${presence.assets.largeImage.slice(8)}`

        const start = presence.timestamps.start
        const end = presence.timestamps.end

        if (message.content.includes('--card')) {
            registerFont('notoserifsemi.otf', { family: 'Noto Serif JP' })

            const canvas = createCanvas(900, 285)
            const ctx = canvas.getContext('2d')
            const bg = await loadImage('https://cdn.discordapp.com/attachments/767235205202444309/786139633192927242/images.png')
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

            const img2 = await loadImage(img)
            ctx.drawImage(img2, 650, 30, 220, 220)

            ctx.font = "bold 30px Noto Serif JP"
            ctx.fillStyle = '#FFFFFF'
            ctx.fillText('Spotify • ' + album, 35, 50)

            ctx.font = "bold 50px Noto Serif JP"
            ctx.fillStyle = '#FFFFFF'
            ctx.fillText(songname, 40, canvas.height / 2)

            ctx.font = "bold 30px Noto Serif JP"
            ctx.fillStyle = '#FFFFFF'
            ctx.fillText(auth, 40, canvas.height / 2 + 50)

            const image = canvas.toBuffer()
            const ath = new MessageAttachment(image, "spotify,png")

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
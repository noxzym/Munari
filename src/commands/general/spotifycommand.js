const { MessageEmbed, MessageAttachment } = require('discord.js')
const { registerFont, createCanvas, loadImage } = require('canvas')
const convert = require('parse-ms')
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

        const songname = presence.details.length <= 13 ? presence.details : presence.details.substr(0, 13).trim() + ' ...';
        const album = presence.assets.largeText.length <= 20 ? presence.assets.largeText : presence.assets.largeText.substr(0, 20).trim() + " ...";
        const auth = presence.state.length <= 10 ? presence.state : presence.state.substr(0, 10).trim() + " ...";
        const title = `${presence.state} • ${presence.details}`
        const url = `https://open.spotify.com/track/${presence.syncID}`
        const img = `https://i.scdn.co/image/${presence.assets.largeImage.slice(8)}`

        const start = presence.timestamps.start
        const end = presence.timestamps.end
        const time = end - start
        const duri = Date.now() - start
        const timestampformatted = (duri / time) * 180
        const convirt = convert(time)

        let menit = convirt.minutes < 10 ? `0${convirt.minutes}` : convirt.minutes;
        let detik = convirt.seconds < 10 ? `0${convirt.seconds}` : convirt.seconds;
        let dur = convert(duri);
        let durationmenit = dur.minutes < 10 ? `0${dur.minutes}` : dur.minutes;
        let durationdetik = dur.seconds < 10 ? `0${dur.seconds}` : dur.seconds;
        const timeleft = `[${durationmenit}:${durationdetik}] - [${menit}:${detik}]`

        if (message.content.includes('--card')) {
            registerFont('notoserifblack.otf', { family: 'Noto Serif JP' })

            const canvas = createCanvas(400, 120);
            const ctx = canvas.getContext("2d");

            const bg = await loadImage(
                "https://cdn.discordapp.com/attachments/767235205202444309/786139633192927242/images.png"
            );
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            const img2 = await loadImage(img);
            ctx.drawImage(img2, 20, 10, 100, 100);

            ctx.font = "bold 20px Noto Serif JP";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(songname, 130, 40);

            ctx.font = "bold 11px Noto Serif JP";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("By " + auth, 130, 60);

            ctx.font = "bold 8px Noto Serif JP";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("On " + album, 130, 80);

            ctx.rect(130, 90, 180, 4);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(130, 90, 180, 4);

            ctx.fillStyle = "#1DB954";
            ctx.fillRect(130, 90, timestampformatted, 4);

            ctx.font = "bold 8px Noto Serif JP";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(timeleft, 320, 95);

            const image = canvas.toBuffer();
            const ath = new MessageAttachment(image, "spotify.png");

            message.channel.send(ath)
        } else {
            const songnameuncard = presence.details
            const albumnocard = presence.assets.largeText
            const authnocard = presence.state
            let e = new MessageEmbed()
                .setColor('18d869 ')
                .setAuthor(`Spotify Song Information`, 'https://media.discordapp.net/attachments/570740974725103636/582005158632882176/Spotify.png')
                .setTitle(`${title}`)
                .setURL(url)
                .setDescription(`\`\`\`asciidoc\n• SongName   :: ${songnameuncard}\n• SongAlbum  :: ${albumnocard}\n• SongAuthor :: ${authnocard}\n\`\`\``)
                .setThumbnail(`${img}`)
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            message.channel.send(e)
        }
    }
}
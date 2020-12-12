const { MessageEmbed, MessageAttachment } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
const ColorThief = require('color-thief');
const colorThief = new ColorThief();
const onecolor = require('onecolor');
const fetch = require('node-fetch')
const convert = require('parse-ms');
module.exports = {
    name: "spotify",
    aliases: [""],
    category: "General",
    descriptions: "Display spotify user",
    usage: "spotify [member<mention/id>]",
    options: ["--card"],
    cooldown: "8",
    ownerOnly: true,
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
            registerFont(__dirname + '/data/regular-font.ttf', { family: 'Manrope', weight: "regular", style: "normal" });
            registerFont(__dirname + '/data/bold-font.ttf', { family: 'Manrope', weight: "bold", style: "normal" });
            const spotifylogo = await loadImage(__dirname +"/data/spotify-logo.png");

            const canvas = createCanvas(400, 120);
            const ctx = canvas.getContext("2d");
            let hex = await GetColor(img)

            //background
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = hex;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.save()
            ctx.globalAlpha = 0.7
            roundRect(ctx, 50, 50, 1800, 260, 20, true, false, '#fff1e5')
            ctx.restore()

            // const bg = await loadImage(
            //     "https://cdn.discordapp.com/attachments/767235205202444309/786139633192927242/images.png"
            // );
            // ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            const img2 = await loadImage(img);
            ctx.drawImage(img2, 20, 10, 100, 100);

            ctx.drawImage(spotifyLogo, 320, 40, 30, 30);

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
        async function GetColor(img) {
            try {
                const result = await fetch(img);
                if (!result.ok) throw new Error("Failed to get the avatar.");
                const a = await result.buffer();

                var rgb = colorThief.getColor(a)
                var rgbCode = 'rgb( ' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
                var hex = onecolor(rgbCode).hex() || member.displayHexColor

                return hex    
            } catch (e) {
                console.error(e)
                return 'Server Error'
            }
        }
        async function roundRect(ctx, x, y, width, height, radius, fill, stroke, color) {
            if (typeof stroke == 'undefined') {
                stroke = true;
            }
            if (typeof radius === 'undefined') {
                radius = 5;
            }
            if (typeof radius === 'number') {
                radius = {
                    tl: radius,
                    tr: radius,
                    br: radius,
                    bl: radius
                };
            } else {
                var defaultRadius = {
                    tl: 0,
                    tr: 0,
                    br: 0,
                    bl: 0
                };
                for (var side in defaultRadius) {
                    radius[side] = radius[side] || defaultRadius[side];
                }
            }
            ctx.beginPath();
            ctx.fillStyle = color
            ctx.moveTo(x + radius.tl, y);
            ctx.lineTo(x + width - radius.tr, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
            ctx.lineTo(x + width, y + height - radius.br);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
            ctx.lineTo(x + radius.bl, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
            ctx.lineTo(x, y + radius.tl);
            ctx.quadraticCurveTo(x, y, x + radius.tl, y);
            ctx.closePath();
            if (fill) {
                ctx.fill();
            }
            if (stroke) {
                ctx.stroke();
            }

        }
    }
}
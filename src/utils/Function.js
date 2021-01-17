const MunariClient = require('../extended/MunariClient');
const { Util, MessageEmbed } = require('discord.js');
const songdata = require('../extended/BaseQueue');

const prettyMilliseconds = require("pretty-ms");
const erityt = require('erit-ytdl');
const yts = require('yt-search');
const color = {
    spotify: "#18d869",
    yt: "#ff0000",
    listen: "#1d1f2b",
    info: "#03fcfc",
    warn: "#FFFF00",
    error: "#FF0000"
}

//Pagination
const pagination = async (send, page, datae, message, option) => {
    await send.react('❌');
    if (option.songs.length > 6) await send.react('➡️');

    var collector = send.createReactionCollector((reaction, user) => ['⬅️', '❌', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000, errors: ['time'] });
    collector.on('collect', async reaction => {
        send.reactions.removeAll().catch(console.error)
        switch (reaction.emoji.name) {

            case '❌':
                await send.delete({ timeout: 3000 })
                break;

            case '⬅️':
                --page;
                send.edit(datae[page]);
                await send.react('❌');
                if (page !== 0) await send.react('⬅️');
                if (page + 1 < datae.length) await send.react('➡️')
                break;

            case '➡️':
                page++;
                send.edit(datae[page]);
                await send.react('❌');
                if (page !== 0) await send.react('⬅️');
                if (page + 1 < datae.length) await v.react('➡️')
                break;

            default:
                break;

        }
    })
    return collector
}

//CreateEmbed
const createEmbed = (type, message) => {
    const embed = new MessageEmbed()
        .setColor(color[type])
    if (message) embed.setDescription(message)

    return embed
}

//FormatMs
const formatMs = (ms) => {
    if (isNaN(ms)) return;
    return prettyMilliseconds(ms, {
        verbose: true,
        compact: false,
        secondsDecimalDigits: 0
    })
};

//play
const play = async (song, message, client) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!song) {
        setTimeout(async function () {
            if (
                !queue.connection.dispatcher &&
                message.guild.me.voice.channel
            ) {
                message.guild.me.voice.channel.leave();
                await message.client.channels.cache.get(queue.textChannel)
                    .send("I have disconnected")
                    .then(msg => {
                        msg.delete({ timeout: 5000 });
                    })
                    .catch(console.error);
            } else return;
        }, 120000);
        message.client.queue.delete(message.guild.id);
        return await message.client.channels.cache.get(queue.textChannel)
            .send(
                "Music queue ended, I'll disconnect in 2 minutes if no songs are playing"
            )
            .then(msg => {
                msg.delete({ timeout: 5000 });
            })
            .catch(console.error);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
    let streamtype = song.url.includes("youtube.com") ? "opus" : "unknown"
    let dispatcher;
    try {
        if (song.url.includes('youtube.com')) {
            dispatcher = queue.connection
                .play(
                    await erityt(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25, bitrate: 96000 }), { type: streamtype }
                )
                .on("finish", () => {

                    if (queue.loop) {
                        let lastSong = queue.songs.shift();
                        queue.songs.push(lastSong);
                        module.exports.play(queue.songs[0], message);
                    } else {
                        queue.songs.shift();
                        module.exports.play(queue.songs[0], message);
                    }
                })
                .on("error", (error) => {
                    console.error(error);
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                })

            dispatcher.setVolumeLogarithmic(queue.volume / 100);
        } else {
            dispatcher = queue.connection
                .play(song.url, { type: streamtype })
                .on("finish", () => {

                    if (queue.loop) {
                        let lastSong = queue.songs.shift();
                        queue.songs.push(lastSong);
                        module.exports.play(queue.songs[0], message);
                    } else {
                        queue.songs.shift();
                        module.exports.play(queue.songs[0], message);
                    }
                })
                .on("error", (error) => {
                    console.error(error);
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                })

            dispatcher.setVolumeLogarithmic(queue.volume / 100);
        }

        let duras = song.duration === undefined ? '◉ LIVE' : song.duration

        let embed = createEmbed("yt")
            .setAuthor(`Youtube Client`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
            .setThumbnail(song.thumbnail)
            .setDescription(`**[${song.title}](${song.url})\nDuration: \`${duras}\`     Channel: \`${song.author}\`**`)
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();

        let embedunk = createEmbed("listen")
            .setAuthor(`Listen.moe`, 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
            .setDescription(`**[${song.title}](${song.url})\nDuration: \`${duras}\`     Channel: \`${song.author}\`**`)
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();

        song.url.includes("youtube.com") ? await message.client.channels.cache.get(queue.textChannel).send(embed) : await message.client.channels.cache.get(queue.textChannel).send(embedunk)

    } catch (e) {
        console.error(e)
        message.channel.send(e.message)
        process.exit(1)
    }
};

//playlist
const playlist = async (url, channel, message, client) => {
    const getdata = await yts({ listId: url })
    const songgetdata = await getdata.videos.map((vid) => {
        return new songdata(song = {
            title: Util.escapeMarkdown(vid.title),
            identifier: vid.videoId,
            author: vid.author.name,
            duration: vid.duration.timestamp,
            nowplaying: vid.duration.seconds,
            url: `https://www.youtube.com/watch?v=${vid.videoId}`,
            thumbnail: vid.thumbnail + "?size=4096",
        }, message.author)
    });

    const queueConstruct = {
        textChannel: message.channel.id,
        voiceChannel: channel.id,
        guildId: message.guild.id,
        songs: [],
        connection: null,
        loop: false,
        volume: 100,
        playing: true
    };

    const queue = client.queue.get(message.guild.id)

    let e = createEmbed("yt")
        .setAuthor(`Youtube Client Playlist`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
        .setTitle(`Playlist Informations • ${getdata.title}`)
        .setURL(getdata.url)
        .setDescription(`**\`\`\`asciidoc\n• Title       :: ${getdata.title}\n• Video       :: ${getdata.videos.map(x => x).length} Videos\n• View        :: ${getdata.views} Views\n\`\`\`**`)
        .setThumbnail(getdata.thumbnail)

    if (queue) {
        queue.songs.push(...songgetdata)
        return client.channels.cache.get(queue.textChannel).send(e)
    }

    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(...songgetdata);

    message.channel.send(e)

    try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message, client);
    } catch (e) {
        console.log(e)
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel
            .send(`I could not join the voice channel: ${error}`)
            .then(msg => {
                msg.delete({ timeout: 5000 });
            });
    }
}

module.exports = {
    play,
    playlist,
    formatMs,
    createEmbed,
    pagination
}
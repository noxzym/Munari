const { Util } = require("discord.js");
const { createEmbed } = require('../../utils/Function')
const yts = require('yt-search')

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "Music",
    descriptions: "Playing song from youtube client",
    usage: "play <[spotify/youtube][title/url/playlist]>",
    options: ["--find"],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["CONNECT", "SPEAK", "EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const { channel } = message.member.voice;
        if (!channel) return message.inlineReply("Please join voice channel first!").catch(console.error).then(msg => { msg.delete({ timeout: 8000 }); });
        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.inlineReply(`I has join channel **\`🔊${message.guild.me.voice.channel.name}\`**`).then(msg => { msg.delete({ timeout: 8000 }); });

        const queue = await message.guild.queue;
        const search = args.join(" ");
        if (!search) return message.channel.send(client.config.prefix + this.usage);

        var queueConstruct = {
            textChannel: message.channel.id,
            voiceChannel: channel.id,
            guildId: message.guild.id,
            songs: [],
            connection: null,
            loop: false,
            volume: 100,
            playing: true,
            timeout: null
        };
        const urlregex = /^https?:\/\//;

        if (urlregex.test(search)) {
            const song = await client.player.getSongs(search);
            if (!song) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Can't get song data`)).then(x => x.delete({ timeout: 10000 }));

            const songmodel = {
                title: song[0].title,
                identifier: song[0].identifier,
                author: song[0].author,
                duration: song[0].duration,
                nowplaying: song[0].nowplaying,
                url: song[0].url,
                thumbnail: song[0].thumbnail,
                requester: message.author
            };

            if (song[0].vid || song[0].sp) {

                if (queue !== null ? queue.songs.length !== 0 && queue.songs.map(x => x.identifier).filter(x => song[0].identifier.includes(x)).map(x => x === song[0].identifier).join() === 'true' : undefined) {
                    return message.channel.send(createEmbed("error", `🚫 | Sorry, this song is already in the queue.`)).then(msg => { msg.delete({ timeout: 8000 }); });
                } else if (queue !== null) {
                    queue.songs.push(songmodel);
                    return message.channel.send(createEmbed("info", `✅ **\`${songmodel.title}\`** by **\`${message.author.username}\`** Has been added to queue!`))
                } else {
                    queueConstruct.songs.push(songmodel)
                }

            } else if (song[0].ytpl) {
                if (queue !== null) {

                    for (let i = 0; i < song.length; i++) {
                        queue.songs.push({
                            title: song[i].title,
                            identifier: song[i].identifier,
                            author: song[i].author,
                            duration: song[i].duration,
                            nowplaying: song[i].nowplaying,
                            url: song[i].url,
                            thumbnail: song[i].thumbnail,
                            requester: message.author
                        })
                    };

                } else {

                    for (let i = 0; i < song.length; i++) {
                        queueConstruct.songs.push({
                            title: song[i].title,
                            identifier: song[i].identifier,
                            author: song[i].author,
                            duration: song[i].duration,
                            nowplaying: song[i].nowplaying,
                            url: song[i].url,
                            thumbnail: song[i].thumbnail,
                            requester: message.author
                        })
                    }

                };
            }

        } else {

            let song;
            try {
                if ((message.content.includes('--find') || message.content.includes("--search"))) {
                    try {
                        var searcher = await yts.search(search)
                        let filter = [
                            "video",
                            "live"
                        ];
                        if (searcher.all[0] === undefined) return message.channel.send(createEmbed("error", `I can't to find related video`)).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
                        let index = 0;
                        let em = createEmbed('yt')
                            .setAuthor(`Youtube Client get Video`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
                            .setTitle(`This is result for ${search}`)
                            .setDescription(`${searcher.all.filter(x => filter.includes(x.type)).slice(0, 5).map(x => `**${++index} • [${x.title}](${x.url}) \`[${x.timestamp}]\`**`).join('\n')}`)
                            .setFooter(`Type 'cancel' to cancel the song request`)
                        var embedsearch = await message.channel.send(em)
                        try {
                            var response = await message.channel.awaitMessages(
                                message2 => /^(?:[1-4]|5|cancel|c)$/g.test(message2.content.toLowerCase()) && message2.author.id === message.author.id, {
                                max: 1,
                                time: 30000,
                                errors: ["time"]
                            }
                            );
                            const input = response.first().content.substr(0, 6).toLowerCase()
                            if (input === 'cancel' || input === 'c') {
                                embedsearch.suppressEmbeds(true).then(x => { x.edit(`<a:no:765207855506522173> | Request canceled`) })
                                return embedsearch.delete({ timeout: 3000 })
                            }
                            embedsearch.delete()
                            const videoIndex = parseInt(response.first().content);
                            var video = await searcher.all[videoIndex - 1];

                        } catch (e) {
                            return message.channel.send(createEmbed("error", "The request has been canceled because no respond!")).then(x => x.delete({ timeout: 3000 }) && embedsearch.delete())
                        }

                        song = {
                            title: Util.escapeMarkdown(video.title),
                            identifier: video.videoId,
                            author: video.author.name,
                            duration: video.timestamp,
                            nowplaying: video.seconds,
                            url: video.url,
                            thumbnail: video.thumbnail + "?size=4096",
                            requester: message.author
                        };

                    } catch (e) {
                        console.log(e);
                        return message.channel.send(createEmbed("error", "I could not find any videos that match that title")).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
                    }
                } else {
                    try {
                        const infoSong = await yts(search);
                        let filter = [
                            "video",
                            "live"
                        ];
                        const vid = infoSong.all.filter(x => filter.includes(x.type))[0];
                        song = {
                            title: Util.escapeMarkdown(vid.title),
                            identifier: vid.videoId,
                            author: vid.author.name,
                            duration: vid.timestamp,
                            nowplaying: vid.seconds,
                            url: vid.url,
                            thumbnail: vid.thumbnail + "?size=4096",
                            requester: message.author
                        };
                    } catch (e) {
                        console.error();
                        message.channel.send(createEmbed("error", "I could not find any videos that match that title")).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
                    }
                }

                const queue = message.guild.queue;

                if (queue ? queue.songs.length !== 0 && queue.songs.map(x => x.identifier).filter(x => song.identifier.includes(x)).map(x => x === song.identifier).join() === 'true' : undefined) {
                    return message.channel.send(createEmbed("error", `🚫 | Sorry, this song is already in the queue.`)).then(msg => { msg.delete({ timeout: 8000 }); });
                };
                if (queue !== null) {
                    queue.songs.push(song);
                    return message.channel.send(createEmbed("info", `✅ **\`${song.title}\`** by **\`${message.author.username}\`** Has been added to queue!`))
                } else {
                    queueConstruct.songs.push(song);
                }

            } catch (err) {
                message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Cannot got song data`)).then(msg => { msg.delete({ timeout: 8000 }); });
            }
        }
        if (queue === null) {
            try {
                message.guild.queue = queueConstruct
                const connection = await message.member.voice.channel.join();
                message.guild.me.voice.setSelfDeaf(true);
                queueConstruct.connection = connection;
                client.player.play(queueConstruct.songs[0], message);
            } catch (error) {
                message.guild.queue = null;
                await channel.leave();
                return message.channel.send(createEmbed("error", `I could not join the voice channel:\n${error}`)).then(msg => { msg.delete({ timeout: 8000 }); });
            }
        }
    }
};
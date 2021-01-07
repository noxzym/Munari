const { MessageEmbed } = require('discord.js')
const erityt = require('erit-ytdl')
module.exports = {
    async play(song, message, client) {
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
            setTimeout(function () {
                if (
                    !queue.connection.dispatcher &&
                    message.guild.me.voice.channel
                ) {
                    message.guild.me.voice.channel.leave();
                    client.channels.cache.get(queue.textChannel)
                        .send("I have disconnected")
                        .then(msg => {
                            msg.delete({ timeout: 5000 });
                        })
                        .catch(console.error);
                } else return;
            }, 120000);
            message.client.queue.delete(message.guild.id);
            return client.channels.cache.get(queue.textChannel)
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

            let embed = new MessageEmbed()
                .setColor('ff0000')
                .setAuthor(`Youtube Client`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
                .setThumbnail(song.thumbnail)
                .setDescription(`**[${song.title}](${song.url})\nDuration: \`${duras}\`     Channel: \`${song.channel}\`**`)
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                .setTimestamp();

            let embedunk = new MessageEmbed()
                .setColor('1d1f2b')
                .setAuthor(`Listen.moe`, 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
                .setThumbnail('https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
                .setDescription(`**[${song.title}](${song.url})\nDuration: \`${duras}\`     Channel: \`${song.channel}\`**`)
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                .setTimestamp();

            song.url.includes("youtube.com") ? client.channels.cache.get(queue.textChannel).send(embed) : client.channels.cache.get(queue.textChannel).send(embedunk)

        } catch (e) {
            console.error(e)
            message.channel.send(e.message)
            process.exit(1)
        }
    }
}

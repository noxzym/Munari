const { MessageEmbed, Util } = require('discord.js')
const { play } = require('./player')
const ytsr = require('youtube-sr')
module.exports = {
    async playlist(url, channel, message, client) {
        const g = await ytsr.getPlaylist(url, { part: 'snippet' })
        const newsong = g.videos.map((x) => {
            return (song = {
                title: Util.escapeMarkdown(x.title),
                url: `https://youtube.com/watch?v=${x.id}`,
                duration: x.durationFormatted,
                nowplaying: x.duration / 1000,
                thumbnail: `https://i.ytimg.com/vi/${x.thumbnail.id}/hq720.jpg?size=4096`,
                requester: `${message.author.tag}`,
                channel: x.channel.name
            })
        })
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            loop: false,
            songs: [],
            volume: 100,
            playing: true
        };

        const queue = client.queue.get(message.guild.id)
        queue ? queue.songs.push(...newsong) : queueConstruct.songs.push(...newsong)
        const songs = queue ? queue.songs : queueConstruct.songs

        let e = new MessageEmbed()
            .setColor('ff0000')
            .setAuthor(`Youtube Client Playlist`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
            .setTitle(`Playlist Informations • ${g.title}`)
            .setURL(g.url)
            .setDescription(`**\`\`\`asciidoc\n• Title       :: ${g.title}\n• Video       :: ${g.videoCount} Videos\n• View        :: ${g.views} Views\n• Last Update :: ${g.lastUpdate.replace('Updated', '').trim()}\`\`\`**`)
            .setThumbnail(g.thumbnail)
        message.channel.send(e)

        if (!queue) {
            client.queue.set(message.guild.id, queueConstruct)
        }

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
}
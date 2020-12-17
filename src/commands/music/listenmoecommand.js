const { play } = require('../../struct/player')
module.exports = {
    name: "listenmoe",
    aliases: ["listen", "moe"],
    category: "Music",
    descriptions: "Play jpop or kpop from listen.moe",
    usage: "listenmoe [options]",
    options: ["--kpop"],
    cooldown: "10",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const queue = client.queue.get(message.guild.id)

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(`You must join voice channel first`)
        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
            return message.channel.send(`I has join channel **\`${message.guild.me.voice.channel.name}\`**`)
        }

        let song;
        if (message.content.includes('--kpop')) {
            song = {
                title: 'Korean pop by Listen.Moe',
                url: 'https://listen.moe/kpop/stream',
                duration: "◉ LIVE",
                thumbnail: 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png',
                nowplaying: 0,
                requester: `${message.author.tag}`,
                channel: 'Listen.Moe'
            };
        } else {
            song = {
                title: 'Japanese pop by Listen.Moe',
                url: 'https://listen.moe/stream',
                duration: "◉ LIVE",
                thumbnail: 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png',
                nowplaying: 0,
                requester: `${message.author.tag}`,
                channel: 'Listen.Moe'
            };
        }

        if (queue) {
            queue.songs.push(song)
            return message.channel.send(`✅ **\`${song.title}\`** by **\`${song.requester}\`** Has been added to queue!`);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            loop: false,
            songs: [],
            volume: 100,
            playing: true
        };

        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message, client);
        } catch (e) {
            console.error();
        }
    }
}



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
    missing: {
        botperms: ["CONNECT", "SPEAK", "EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(`You must join voice channel first`)
        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I has join channel **\`${message.guild.me.voice.channel.name}\`**`)

        const queue = message.guild.queue;
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

        let songdata = []
        if (message.content.includes('--kpop')) {

            songdata.push({
                title: 'Korean pop by Listen.Moe',
                identifier: 'Kpop',
                author: 'Listen.Moe',
                duration: "◉ LIVE ",
                nowplaying: undefined,
                url: 'https://listen.moe/kpop/stream',
                thumbnail: 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png',
            })

        } else {

            songdata.push({
                title: 'Japanese pop by Listen.Moe',
                identifier: 'Jpop',
                author: 'Listen.Moe',
                duration: "◉ LIVE ",
                nowplaying: undefined,
                url: 'https://listen.moe/stream',
                thumbnail: 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png',
            })

        }

        const songmodel = {
            title: songdata[0].title,
            identifier: songdata[0].identifier,
            author: songdata[0].author,
            duration: songdata[0].duration,
            nowplaying: songdata[0].nowplaying,
            url: songdata[0].url,
            thumbnail: songdata[0].thumbnail,
            requester: message.author
        }
        if (queue !== null) {
            queue.songs.push(songmodel)
            return message.channel.send(`✅ **\`${songmodel.title}\`** by **\`${songmodel.requester.username}\`** Has been added to queue!`);
        } else {
            queueConstruct.songs.push(songmodel)
        }

        if (queue === null) {
            try {
                message.guild.queue = queueConstruct;
                const connection = await message.member.voice.channel.join();
                message.guild.me.voice.setSelfDeaf(true);
                queueConstruct.connection = connection;
                client.music.manager.play(queueConstruct.songs[0], message);
            } catch (e) {
                console.log(e)
            }
        }
    }
}



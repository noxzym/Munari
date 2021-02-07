const { createEmbed } = require("../../utils/Function");

module.exports = {
    name: "shuffle",
    aliases: ["sh"],
    category: "Music",
    descriptions: "Shuffle queue",
    usage: "shuffle",
    options: null,
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const queue = message.guild.queue
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }))
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }))
        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to shuffle the music")).then(x => x.delete({ timeout: 10000 }))

        const songs = queue.songs
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.guild.queue = queue;

        message.channel.send(createEmbed("info", `**The queue has been shufled by \`${message.author.username}\`**`)).then(x => x.delete({ timeout: 10000 }))
    }
}
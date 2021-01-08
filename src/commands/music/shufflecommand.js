module.exports = {
    name: "shuffle",
    aliases: ["sh"],
    category: "Music",
    descriptions: "Shuffle queue",
    usage: "shuffle",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const { channel } = message.member.voice;
        if (!channel) return message.reply("Please join voice channel first!").catch(console.error).then(msg => { msg.delete({ timeout: 8000 }); });

        const queue = client.queue.get(message.guild.id)
        const songs = queue.songs

        if (message.guild.me.voice.channel !== null && channel.id !== queue.voiceChannel) return message.channel.send(`I has join channel **\`🔊${message.guild.me.voice.channel.name}\`**`).then(msg => { msg.delete({ timeout: 8000 }); });

        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }

        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);

        await client.channels.cache.get(queue.textChannel)
            .send(`<a:yes:765207711423004676> | ${songs[0].requester.username} has shuffled the queue!`)
            .then(msg => { msg.delete({ timeout: 5000 }); })
            .catch(console.error);
    }
}
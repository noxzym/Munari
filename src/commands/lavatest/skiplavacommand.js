const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
    name: "skiplava",
    aliases: ["slava"],
    category: "Developer",
    descriptions: "Skpip the current playing",
    usage: "slava",
    options: null,
    cooldown: "5",
    ownerOnly: true,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const queue = message.guild.queue;
        if (queue === null) return;
        const { channel } = message.member.voice;
        if (!channel) return;

        await queue.connection.stopTrack()
        return message.channel.send(createEmbed("info", `**The current song has been skipped by \`${message.author.username}\`**`))
    }
};
const alex = require('alexflipnote.js')
const { MessageAttachment } = require('discord.js')
module.exports = {
    name: "sadcat",
    aliases: null,
    category: "Animal",
    descriptions: "Give you a random picture about sad cat",
    usage: "sadcat",
    options: null,
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const { image } = new alex(client.config.alexapi)
        const img = await image.sadcat()
        const ath = new MessageAttachment(img.file, "sadcat.png")
        message.channel.send(ath)
    }
}
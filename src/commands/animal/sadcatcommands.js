const alex = require('alexflipnote.js')
const { MessageAttachment } = require('discord.js')
module.exports = {
    name: "sadcat",
    aliases: [""],
    category: "Animal",
    descriptions: "Give you a random picture about sad cat",
    usage: "sadcat",
    options: [""],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const { image } = new alex(client.config.alexapi)
        const img = await image.sadcat()
        const ath = new MessageAttachment(img.file, "sadcat.png")
        message.channel.send(ath)
    }
}
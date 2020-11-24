const { MessageEmbed, MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
const { image } = new alex('93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb')
module.exports = {
    name: "supreme",
    aliases: [""],
    category: "Fun",
    descriptions: "Generate supreme message",
    usage: "supreme text",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const input = args[0]
        
        if (!input) message.channel.send(`Please provide some text.`)
        if (input.length > 15) return message.channel.send(`You provide text oversize`)

        const img = await image.supreme({ text: `${input}` })

        let ath = new Discord.MessageAttachment(img, "supreme.png")
        message.channel.send(ath)
    }
}
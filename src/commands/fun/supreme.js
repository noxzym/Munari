const { MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
    name: "supreme",
    aliases: [""],
    category: "Fun",
    descriptions: "Generate supreme message",
    usage: "supreme text",
    options: ["--dark"],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const { image } = new alex(client.config.alexapi)
        const input = args.slice(0).join(' ')

        if (!input) message.channel.send(`Please provide some text.`)
        if (input.length > 15) return message.channel.send(`You provide text oversize`)

        let img;
        if (input.includes('--dark')) {
            let inputin = input.replace('--dark', '')
            img = await image.supreme({ text: `${inputin}`, dark: true })
        } else {
         img = await image.supreme({ text: `${input}` })
        }
        let ath = new MessageAttachment(img, "supreme.png")
        message.channel.send(ath)
    }
}
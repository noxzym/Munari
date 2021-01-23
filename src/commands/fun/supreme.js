const { MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
    name: "supreme",
    aliases: null,
    category: "Fun",
    descriptions: "Generate supreme message",
    usage: "supreme text",
    options: ["--dark", "--light"],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const { image } = new alex(client.config.alexapi)
        const input = args.slice(0).join(' ')

        if (!input) client.commandmanager.command.get('help').run(client, message, [this.name]).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        if (input.length > 15) return message.channel.send(`You provide text oversize`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

        let img;
        if (input.includes('--dark')) {
            let inputin = input.replace('--dark', '')
            img = await image.supreme({ text: `${inputin}`, dark: true })
        } else if (input.includes('--light')) {
            let inputin = input.replace('--light', '')
            img = await image.supreme({ text: `${inputin}`, light: true })
        } else {
         img = await image.supreme({ text: `${input}` })
        }
        let ath = new MessageAttachment(img, "supreme.png")
        message.channel.send(ath)
    }
}

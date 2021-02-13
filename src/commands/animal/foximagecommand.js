const fetch = require("node-fetch");
const { createEmbed } = require("../../utils/createEmbed")

module.exports = {
    name: "fox",
    aliases: null,
    category: "Animal",
    descriptions: "Give you fox image",
    usage: "fox",
    options: null,
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(bot, message, args) {
        const { image } = await fetch("https://randomfox.ca/floof/").then(x => x.json())
        const e = createEmbed("info")
            .setAuthor(`Fox Image`, "https://cdn.discordapp.com/attachments/795512730940735508/805404040636792842/fox_1f98a.png", "https://randomfox.ca/floof/")
            .setImage(image)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        message.channel.send(e)
    }
}
const { Util } = require("discord.js")
const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
    name: "respect",
    aliases: ["f"],
    category: "General",
    descriptions: "Pay the respect",
    usage: "respect [user]",
    options: null,
    cooldown: "60",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["ADD_REACTIONS", "EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        let reason = args.join(" ")

        let data
        if (reason) {
            data = `**Press 🇫 to pay your respect for \`${Util.cleanContent(reason, message).replace("@", "")}\`**`
        } else {
            data = `**Press 🇫 to pay your respect**`
        }

        let e = createEmbed("info")
            .setDescription(data)

        var respect = await message.channel.send(e)
        await respect.react("🇫")
        const collector = respect.createReactionCollector((reaction, user) => reaction.emoji.name === "🇫" && user.id !== client.user.id, { time: 60000, errors: ["time"] });
        const array = [];
        collector.on("collect", async (reaction, user) => {
            switch (reaction.emoji.name) {
                case "🇫":
                    if (array.includes(user.id)) return
                    array.push(user.id);
                    message.channel.send(`**\`${user.tag}\` just paid their respect**`)
                    break;

                default:
                    break;
            }
        })
        collector.on("end", () => {
            const data = array.length
            if (reason) {
                desc = data !== undefined ? data !== 0 ? `**Total \`${data}\` User has paid their respect for \`${Util.cleanContent(reason, message).replace("@", "")}\`**` : `**Nobody paid their respect for ${Util.cleanContent(reason, message).replace("@", "")}**` : `**Nobody paid their respect for \`${Util.cleanContent(reason, message).replace("@", "")}\`**`;
            } else {
                desc = data !== undefined ? data !== 0 ? `**Total \`${data}\` User has paid their respect**` : `**Nobody paid their respect**` : `**Nobody paid their respect**`;
            }

            let ed = createEmbed("info")
                .setDescription(desc)

            message.channel.send(ed)
            respect.delete()
            return array.splice(0, array.length)
        });
    }
}
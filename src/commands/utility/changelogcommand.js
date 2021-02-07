const { MessageEmbed } = require("discord.js");
const { data } = require('../../data/changelog.json');
const { pagination, createEmbed } = require("../../utils/Function");

module.exports = {
    name: "changelog",
    aliases: ["latest"],
    category: "Utility",
    descriptions: "Get information about latest update",
    usage: "changelog",
    options: null,
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: null,
        userperms: null
    },
    async run(client, message, args) {

        let page = 0;
        const embed = geneembed(message, data);
        let ems = await message.channel.send(embed[page])
        pagination(ems, page, embed, message, data.length, 6)

        function geneembed(message, data) {
            let array = [];
            let k = 5;
            for (let i = 0; i < data.length; i += 5) {
                const current = data.slice(i, k);
                let j = i + 1
                k += 5
                const map = current.map((x) => `**${j++}. ${x.date}**\n${x.content.join("\n")}`).join("\n\n");

                let e = createEmbed("info")
                    .setAuthor("Changelog", client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
                    .setDescription(map)
                    .setTimestamp()
                    .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
                array.push(e)
            }
            return array;
        };
    }
}
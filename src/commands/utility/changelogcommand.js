const { createEmbed } = require("../../utils/createEmbed");
const { data } = require('../../data/changelog.json');

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
        const embed = await geneembed(message, data, client);
        let ems = await message.channel.send(embed[page])
        await client.util.pagination(ems, page, embed, message, client)
    }
};

async function geneembed(message, data, client) {
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
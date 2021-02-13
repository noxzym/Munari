const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
    name: "snipe",
    aliases: null,
    category: "Utility",
    descriptions: "Get last message delete",
    usage: "snipe [channel[mention/id]]",
    options: ["--all"],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first() || message.channel;
        const snipes = client.snipes.get(channel.id);
        if (!snipes) return message.channel.send(createEmbed("error", `I can't get last message delete in channel **\`${channel.name}\`**`)).then(msg => { msg.delete({ timeout: 10000 }) });

        let page = 0;
        const embeds = await geneembed(snipes, channel)
        let send = await message.channel.send(embeds[page])

        if (args.join(" ").toLowerCase().includes("--all")) return await client.util.pagination(send, page, embeds, message, client)
    }
}

async function geneembed(snipes, channel) {
    const embeds = [];
    let k = 1;
    for (let i = 0; i < snipes.length; i++) {
        const now = snipes.slice(i, k);
        k += 5;
        const maping = await now[0];

        const content = maping.content.length <= 2047 ? maping.content : maping.content.substr(0, 2047).trim() + " ...";
        let e = createEmbed("info")
            .setAuthor(`Message Deleted by ${maping.author.tag}`, maping.author.avatarURL({ dynamic: true }))
            .setDescription(content)
            .setImage(maping.image)
            .setFooter(`${maping.date} • #${channel.name}`)
        embeds.push(e);
    };
    return embeds
}
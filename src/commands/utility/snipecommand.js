const { createEmbed, pagination } = require('../../utils/Function');

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
        const snipes = client.snipes.filter(x => x.channel === channel.id);
        if (snipes.length === 0) return message.channel.send(createEmbed("error", `I can't get last message delete in channel **\`${channel.name}\`**`)).then(msg => { msg.delete({ timeout: 10000 }) });

        let page = 0;
        const embeds = await geneembed(snipes, channel)
        let send = await message.channel.send(embeds[page])

        if (args.join('').toLowerCase().match(/^(?:--all)$/g)) return pagination(send, page, embeds, message, client)
    }
}

async function geneembed(data, channel) {
    const embeds = [];
    let k = 1;
    for (let i = 0; i < data.length; i++) {
        const now = data.slice(i, k);
        k += 5;
        const maping = await now.map(x => x)[0]
        let e = createEmbed("info")
            .setAuthor(`Message Delete by ${maping.author.tag}`, maping.author.avatarURL({ dynamic: true }))
            .setDescription(maping.content.length <= 1091 ? maping.content : maping.content.substr(0, 1091).trim() + ' ...')
            .setImage(maping.image)
            .setFooter(`${maping.date} • #${channel.name}`)
        embeds.push(e);
    };
    return embeds
}
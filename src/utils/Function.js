const { MessageEmbed } = require('discord.js');

const prettyMilliseconds = require("pretty-ms");
const color = {
    spotify: "#18d869",
    yt: "#ff0000",
    listen: "#1d1f2b",
    info: "#03fcfc",
    warn: "#FFFF00",
    error: "#FF0000"
}

//CreateEmbed
const createEmbed = (type, message) => {
    const embed = new MessageEmbed()
        .setColor(color[type])
    if (message) embed.setDescription(message)

    return embed
}

//FormatMs
const formatMs = (ms) => {
    if (isNaN(ms)) return;
    return prettyMilliseconds(ms, {
        verbose: true,
        compact: false,
        secondsDecimalDigits: 0
    })
};

//Pagination
const pagination = async (send, page, datae, message, option, pages) => {
    await send.react('⬅️');
    await send.react('❌');
    await send.react('➡️');

    var collector = send.createReactionCollector((reaction, user) => ['⬅️', '❌', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id);
    collector.on('collect', async (reaction, user) => {
        switch (reaction.emoji.name) {

            case '❌':
                await send.delete()
                break;

            case '⬅️':
                reaction.users.remove(user)
                if (page === 0) return
                --page;
                send.edit(datae[page]);
                break;

            case '➡️':
                reaction.users.remove(user)
                if (page + 2 > datae.length) return
                page++;
                send.edit(datae[page]);
                break;

            default:
                break;

        }
    })
    return collector
};

module.exports = {
    formatMs,
    createEmbed,
    pagination
}
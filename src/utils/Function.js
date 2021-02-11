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

//DeleteMessage
const Deleted = async(send, message) => {
    const emo = ["🇽"];
    for (const emoji of emo) await send.react(emoji);

    var collector = send.createReactionCollector((reaction, user) => emo.includes(reaction.emoji.name) && user.id === message.author.id);
    collector.on("collect", async(reaction) => {
        switch (reaction.emoji.name) {
            case "🇽":
                await send.delete()
                break;
        
            default:
                break;
        }
    })
}

//Pagination
const pagination = async (send, page, datae, message, client) => {
    const emo = ["🇽", "⏪", "⬅️", "➡️", "⏩", "⏹️"];
    for (const emoji of emo) await send.react(emoji);

    var collector = send.createReactionCollector((reaction, user) => emo.includes(reaction.emoji.name) && user.id === message.author.id);
    collector.on('collect', async (reaction, user) => {
        switch (reaction.emoji.name) {

            case "🇽":
                await send.delete();
                break;

            case "⏹️":
                message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await send.reactions.removeAll() : undefined;
                await collector.stop();
                break;

            case "⏪":
                message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                if (page === 0) return;
                page = datae.length - datae.length
                send.edit(datae[page]);
                break;

            case "⏩":
                message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                page = datae.length - 1;
                send.edit(datae[page]);
                break;

            case "⬅️":
                message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                if (page === 0) return
                --page;
                send.edit(datae[page]);
                break;

            case "➡️":
                message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
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
    Deleted,
    pagination
}
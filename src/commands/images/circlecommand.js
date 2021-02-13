const { MessageAttachment, Util } = require("discord.js");
const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
    name: "circle",
    aliases: null,
    category: "Image",
    descriptions: "Change image to circle",
    usage: "circle [user/^]",
    options: null,
    cooldown: "10",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const parse = message.content.trim().split(" ");
        const parsedata = parse[1] !== undefined && parse[1].includes("^") ? parse[1].length : 0;
        const fetchmsg = await message.channel.messages.fetch(true).then(x => { return x.map(x => x)[parsedata] })

        var fetched = await message.channel.send(`Processing Image <a:LoadingFetch:785715659727175731>`)
        var fetchattachment, fetchembeds, fetchmsgauthor, fetchemojimsg, mentionuser, mentionuserid, fetchavatarauthor;
        try {
            fetchattachment = fetchmsg.attachments.size !== 0 ? fetchmsg.attachments.first().url : undefined;
            fetchembeds = fetchattachment === undefined && fetchmsg.embeds.map(x => { return x.image }).join(" ") !== '' ? fetchmsg.embeds.map(x => { return x.image.url }).join(" ") : undefined;
            fetchmsgauthor = fetchattachment === undefined && fetchembeds === undefined && fetchmsg.content.includes("https://cdn.discordapp.com") ? fetchmsg.content.trim().split(" ")[1] : undefined;
            fetchemojimsg = fetchattachment === undefined && fetchembeds === undefined && !fetchmsg.content.includes("https://cdn.discordapp.com") && Util.parseEmoji(fetchmsg.content).id !== null ? Util.parseEmoji(fetchmsg.content).animated === false ? `https://cdn.discordapp.com/emojis/${Util.parseEmoji(fetchmsg.content).id}.png?size=4096` : `https://cdn.discordapp.com/emojis/${Util.parseEmoji(fetchmsg.content).id}.gif` : undefined;
            mentionuser = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && fetchemojimsg === undefined && Util.parseEmoji(fetchmsg.content).id === null && message.mentions.members.first() !== undefined ? message.mentions.members.first().user.avatarURL({ size: 4096, format: "png" }) : undefined;
            mentionuserid = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && fetchemojimsg === undefined && Util.parseEmoji(fetchmsg.content).id === null && message.mentions.members.first() === undefined && message.guild.members.cache.get(args[0]) !== undefined ? message.guild.members.cache.get(args[0]).user.avatarURL({ size: 4096, format: "png" }) : undefined;
            fetchavatarauthor = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && fetchemojimsg === undefined && Util.parseEmoji(fetchmsg.content).id === null && mentionuser === undefined && mentionuserid === undefined ? fetchmsg.author.avatarURL({ size: 4096, format: "png" }) : undefined;
        } catch {
            fetched.delete()
            return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Discord Image only")).then(x => x.delete({ timeout: 10000 }))
        }

        const data = fetchattachment || fetchembeds || fetchmsgauthor || fetchemojimsg || mentionuser || mentionuserid || fetchavatarauthor;
        var img = await client.util.circle(data)
        const ath = new MessageAttachment(img, "Circle.png");

        let e = createEmbed("info")
            .setImage('attachment://Circle.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ files: [ath], embed: e })
        fetched.delete()
    }
}
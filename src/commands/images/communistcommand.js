const { createEmbed } = require("../../utils/createEmbed");
const { MessageAttachment, Util } = require('discord.js');
const alex = require('alexflipnote.js');

module.exports = {
    name: "communist",
    aliases: null,
    category: "Image",
    descriptions: "Are you communist?",
    usage: "communist [user]",
    options: null,
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        const { image } = new alex(client.config.alexapi)

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
        const img = await image.communist({ image: data })
        let ath = new MessageAttachment(img, "communist.png")

        let e = createEmbed("info")
            .setImage('attachment://communist.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ files: [ath], embed: e })
        fetched.delete()
    }
}
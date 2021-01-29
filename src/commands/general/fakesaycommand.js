const { createEmbed } = require("../../utils/Function")

module.exports = {
    name: "fakesay",
    aliases: ["fake"],
    category: "General",
    descriptions: "Make someone to say something",
    usage: "fakesay <user[mention/id]> <text>",
    options: null,
    cooldown: "10",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
        if (!member) return message.channel.send(createEmbed("error", "Operation Canceled, You need to mention someone")).then(x => { x.delete({ timeout: 10000 }) })
        const data = args.slice(1)
        if (!data) return message.channel.send(createEmbed("error", "Operation Canceled, You need input some message")).then(x => { x.delete({ timeout: 10000 }) })
        if (!message.channel.permissionsFor(client.user.id).has("MANAGE_WEBHOOKS")) return message.channel.send(createEmbed("error", "Operation Canceled, Because i need permission of **\`MANAGE_WEBHOOKS\`**")).then(x => { x.delete({ timeout: 10000 }) })
        
        var fetched = await message.channel.send(`Please wait <a:LoadingFetch:785715659727175731>`)
        try {
            message.channel.createWebhook(member.nickname ? member.nickname : member.user.username, { 
                avatar: member.user.avatarURL({ size: 4096, format: "png" }) 
            }).then(x => {
                x.send(data.join(" "));
                setTimeout(() => {
                    x.delete()
                }, 2000);
            })
            fetched.delete()
        } catch (e) {
            console.log(e)
            fetched.delete()
        }
    }
}
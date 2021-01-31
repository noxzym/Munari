const { Blacklist } = require('../../struct/MongoModels');
const { createEmbed } = require("../../utils/Function")

module.exports = {
    name: "blacklist",
    aliases: ["bl"],
    category: "Developer",
    descriptions: "Denied to access command",
    usage: "blacklist <user/id>",
    options: null,
    cooldown: null,
    ownerOnly: true,
    guildOnly: true,
    missing: {
        botperms: null,
        userperms: null
    },
    async run(client, message, args) {
        const user = client.users.cache.get(args[0]) || message.mentions.users.first();
        if (!user) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You need to mention someone")).then(x => { x.delete({ timeout: 10000 }) });
        if (user.id === message.author.id || user.id === client.user.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Invalid User")).then(x => { x.delete({ timeout: 10000 }) });

        const toblacklist = await Blacklist.findOne({ UserId: user.id }, async (err, data) => {
            if (err) throw err;
            return data;
        });

        if (toblacklist) {
            return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. This User: **\`${user.username}:${user.id}\`** has been Blacklisted`)).then(x => { x.delete({ timeout: 10000 }) })
        } else {
            try {
                const newBlacklisted = new Blacklist({ UserId: user.id });
                newBlacklisted.save().catch(e => console.log(e))
                return message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to Blacklist **\`${user.username}:${user.id}\`** Successful!`)).then(x => { x.delete({ timeout: 10000 }) })
            } catch (e) {
                console.log(e)
            }
        }
    }
}
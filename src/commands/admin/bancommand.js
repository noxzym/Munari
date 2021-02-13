const { createEmbed } = require("../../utils/createEmbed")

module.exports = {
    name: "ban",
    aliases: null,
    category: "Moderation",
    descriptions: "Ban user from the guild",
    usage: "ban <user[mention/id]>",
    options: ["--force"],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["BAN_MEMBERS", "EMBED_LINKS"],
        userperms: ["BAN_MEMBERS"]
    },
    async run(client, message, args) {
        const member =
            message.guild.members.cache.get(args[0]) ||
            message.mentions.members.first() ||
            args[0]

        if (!member) return message.channel.send(`Wrong input, you need to mention member first`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (isNaN(member)) return message.channel.send(`Wrong input, you need to mention member first`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (message.channel.activateCollector === true) return message.channel.send("please wait until the timeout over or response has given").then(msg => { msg.delete({ timeout: 5000 }) });

        let reason = args.slice(1).join(' ');
        if (!reason) {
            reason = " - ";
        }
        else {
            reason = `${reason}`
        }

        try {
            if (member.user !== undefined) {

                if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0) return message.channel.send(`My Highest role must be higher than **\`${member.user.username}\`** highest role!`).then(msg => { msg.delete({ timeout: 10000 }) })
                if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(`This member has permission **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 10000 }) })
                if (!member.bannable) return message.channel.send("This member is not kickable").then(msg => { msg.delete({ timeout: 10000 }) })
                if (member.user.id === message.author.id) return message.channel.send(`You can't kicked yourself`).then(msg => { msg.delete({ timeout: 10000 }) })
                if (member.user.id === message.client.user.id) return message.channel.send(`I can't kick myself`).then(msg => { msg.delete({ timeout: 10000 }) })

            }

            var tag;
            var id;
            if (member.user !== undefined) {
                tag = member.user.tag
                id = member.user.id
            } else {
                const data = await client.users.fetch(member)
                tag = data.tag
                id = member
            }

            var databan = await message.guild.fetchBans()
        } catch (e) {
            return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Unknown User")).then(msg => { msg.delete({ timeout: 10000 }) })
        }

        if (databan.get(id) !== undefined) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. This user has been banned from this guild`)).then(msg => { msg.delete({ timeout: 10000 }) })

        if (message.content.includes("--force")) {
            message.guild.members.ban(member, { reason: reason }).catch(e => {
                return message.channel.send(createEmbed("error", `Sorry i couldn't banned this user because ${e}`)).then(msg => { msg.delete({ timeout: 10000 }) })
            })
            return message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to banned **\`${tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
        }

        try {
            message.channel.activateCollector = true
            var react = await message.channel.send(createEmbed("info", `Are you sure to banned **\`${tag}\`**?`));
            await react.react('✅');
            await react.react('❎');
            const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
            var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
            collector.on('collect', (reaction, user) => {
                if (collector && !collector.ended) collector.stop();
                switch (reaction.emoji.name) {
                    case "✅":
                        reaction.users.remove(user).catch(console.error)
                        message.guild.members.ban(member, { reason: reason.replace("--force") }).catch(e => {
                            return message.channel.send(createEmbed("error", `Sorry i couldn't banned this user because ${e}`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        })
                        react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to banned **\`${tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        return message.channel.activateCollector = false
                        break;

                    case "❎":
                        reaction.users.remove(user).catch(console.error)
                        react.edit(createEmbed("error", `<a:no:765207855506522173> | Operation to banned **\`${tag}\`** has canceled!`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        return message.channel.activateCollector = false
                        break;

                    default:
                        reaction.users.remove(user).catch(console.error)
                        break;
                }
            })
            collector.on('end', () => {
                react.reactions.removeAll().catch(console.error);
                return message.channel.activateCollector = false
            })
        } catch (e) {
            console.log(e)
            return message.channel.activateCollector = false
        }
    }
}
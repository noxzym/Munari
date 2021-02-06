const { createEmbed } = require("../../utils/Function")

module.exports = {
    name: "unmute",
    aliases: null,
    category: "Moderation",
    descriptions: "Re-enable send message to user",
    usage: "unmute <user[mention/id]>",
    options: ["--force"],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["MANAGE_ROLES", "EMBED_LINKS"],
        userperms: ["MANAGE_ROLES"]
    },
    async run(client, message, args) {
        const member =
            message.guild.members.cache.get(args[0]) ||
            message.mentions.members.first()
        if (!member) return message.channel.send(`Wrong input, you need to mention member first`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (message.channel.activateCollector === true) return message.channel.send("please wait until the timeout over or response has given").then(msg => { msg.delete({ timeout: 10000 }) });

        let reason = args.slice(1).join(' ');
        if (!reason) {
            reason = " - ";
        }
        else {
            reason = `${reason}`
        }

        if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0) return message.channel.send(`My Highest role must be higher than **\`${member.user.username}\`** highest role!`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(`This member has permission **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 10000 }) })

        let muterole = message.guild.roles.cache.find(r => r.name === 'Muted');
        if (!muterole) return message.channel.send(createEmbed("error", `I can't get role **\`Muted\`** in this server`)).then(msg => { msg.delete({ timeout: 10000 }) })
        if (message.guild.me.roles.highest.comparePositionTo(muterole.id) < 0) return message.channel.send(createEmbed("errpr", `<a:yes:765207711423004676> | Operation Canceled, because: My highest role must be hinger than my mute role`)).then(msg => { msg.delete({ timeout: 10000 }) })
        if (!member.roles.cache.some(r => muterole.id === r.id)) return message.channel.send(createEmbed("error", `<a:yes:765207711423004676> | Operation Canceled, because: **\`${member.tag}\`** wasn't muted now`)).then(msg => { msg.delete({ timeout: 10000 }) })

        if (message.content.includes("--force")) {
            member.roles.remove(muterole.id, reason.replace("--force", "")).catch(x => {
                return message.channel.send(createEmbed("error", `<a:yes:765207711423004676> | Operation Canceled, because: ${x}`)).then(msg => { msg.delete({ timeout: 10000 }) })
            })
            return message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to unmute user **\`${member.user.tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
        }
        try {
            message.channel.activateCollector = true
            var react = await message.channel.send(createEmbed("info", `Are you sure to unmute **\`${member.user.tag}\`**?`));
            await react.react('✅');
            await react.react('❎');
            const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
            var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
            collector.on('collect', (reaction, user) => {
                if (collector && !collector.ended) collector.stop();
                switch (reaction.emoji.name) {
                    case "✅":
                        reaction.users.remove(user).catch(console.error)
                        member.roles.remove(muterole.id).catch(x => {
                            return message.channel.send(createEmbed("error", `<a:yes:765207711423004676> | Operation Canceled, because: ${x}`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        })
                        react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to unmute user **\`${member.user.tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        return message.channel.activateCollector = false
                        break;

                    case "❎":
                        reaction.users.remove(user).catch(console.error)
                        react.edit(createEmbed("error", `<a:no:765207855506522173> | Operation to unmute user **\`${member.user.tag}\`** has canceled!`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        return message.channel.activateCollector = false
                        break;

                    default:
                        reaction.users.remove(user).catch(console.error)
                        break;
                }
            })
            collector.on('end', () => {
                react.reactions.removeAll().catch(console.error);
            })
        } catch (e) {
            console.log(e)
            return message.channel.activateCollector = false
        }
    }
}
const { createEmbed } = require("../../utils/Function")

module.exports = {
    name: "kick",
    aliases: null,
    category: "Moderation",
    descriptions: "Kick user from the guild",
    usage: "kick <user[mention/id]>",
    options: ["--force"],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member =
            message.guild.members.cache.get(args[0]) ||
            message.mentions.members.first()
        if (!member) return message.channel.send(`Wrong input, you need to mention member first`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (!message.guild.me.hasPermission('KICK_MEMBERS' || 'BAN_MEMBERS' || 'ADMINISTRATOR')) return message.channel.send(`I need permissions for **\`KICK_MEMBERS\`** or **\`BAN_MEMBERS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (!message.member.hasPermission('KICK_MEMBERS' || 'BAN_MEMBERS' || 'ADMINISTRATOR')) return message.channel.send(`You need permissions for **\`KICK_MEMBERS\`** or **\`BAN_MEMBERS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (message.channel.activateCollector === true) return message.channel.send("please wait until the timeout over or response has given").then(msg => { msg.delete({ timeout: 5000 }) });

        let reason = args.slice(1).join(' ');
        if (!reason) {
            reason = " - ";
        }
        else {
            reason = `${reason}`
        }

        if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0) return message.channel.send(`My Highest role must be higher than **\`${member.user.username}\`** highest role!`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(`This member has permission **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (!member.kickable) return message.channel.send("This member is not kickable").then(msg => { msg.delete({ timeout: 10000 }) })
        if (member.user.id === message.author.id) return message.channel.send(`You can't kicked yourself`).then(msg => { msg.delete({ timeout: 10000 }) })
        if (member.user.id === message.client.user.id) return message.channel.send(`I can't kick myself`).then(msg => { msg.delete({ timeout: 10000 }) })

        if (message.content.includes("--force")) {
            member.kick(reason).catch(e => {
                return message.channel.send(createEmbed("error", `Sorry i couldn't kick this user because ${e}`)).then(msg => { msg.delete({ timeout: 10000 }) })
            })
            react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to kick **\`${member.user.tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
            return message.channel.activateCollector = false
        }

        try {
            message.channel.activateCollector = true
            var react = await message.channel.send(createEmbed("info", `Are you sure to Kick **\`${member.user.tag}\`**?`));
            await react.react('✅');
            await react.react('❎');
            const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
            var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
            collector.on('collect', (reaction, user) => {
                if (collector && !collector.ended) collector.stop();
                switch (reaction.emoji.name) {
                    case "✅":
                        reaction.users.remove(user).catch(console.error)
                        member.kick(reason.replace("--force")).catch(e => {
                            return message.channel.send(createEmbed("error", `Sorry i couldn't kick this user because ${e}`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        })
                        react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to kick **\`${member.user.tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
                        return message.channel.activateCollector = false
                        break;

                    case "❎":
                        reaction.users.remove(user).catch(console.error)
                        react.edit(createEmbed("error", `<a:no:765207855506522173> | Operation to kick **\`${member.user.tag}\`** has canceled!`)).then(msg => { msg.delete({ timeout: 10000 }) })
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
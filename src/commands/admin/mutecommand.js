const { createEmbed } = require("../../utils/Function")

module.exports = {
    name: "mute",
    aliases: null,
    category: "Moderation",
    descriptions: "Disable send message to user",
    usage: "mute <user[mention/id]>",
    options: ["--force"],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["MANAGE_ROLES"],
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

        try {
            let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
            if (!muteRole) {
                try {
                    muteRole = await message.guild.roles.create({
                        data: {
                            name: "Muted",
                            color: "#514f48",
                            permissions: []
                        }
                    });
                } catch (e) {
                    console.log(e.stack);
                }
            }
            if (message.guild.me.roles.highest.comparePositionTo(message.guild.roles.cache.find(x => x.name === "Muted").id) < 0) return message.channel.send(`My highest role must be hinger than my mute role`).then(msg => { msg.delete({ timeout: 10000 }) })

            message.guild.channels.cache.forEach(channel => {
                channel.updateOverwrite(muteRole, {
                    SEND_MESSAGES: false,
                    ATTACH_FILES: false,
                    SEND_TTS_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false,
                    STREAM: false
                });
            });

            if (member.roles.cache.some(r => muteRole.id === r.id)) return message.channel.send(createEmbed("error", `<a:yes:765207711423004676> | Operation Canceled, because: **\`${member.tag}\`** Has been muted`)).then(msg => { msg.delete({ timeout: 10000 }) })
            if (message.content.includes("--force")) {
                member.roles.add(muteRole.id, reason.replace("--force", "")).catch(x => {
                    return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Because: ${x}`)).then(msg => { msg.delete({ timeout: 10000 }) })
                })
                return message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to mute **\`${member.user.tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
            }
            try {
                message.channel.activateCollector = true
                var react = await message.channel.send(createEmbed("info", `Are you sure to Muted **\`${member.user.tag}\`**?`))
                await react.react("✅");
                await react.react("❎");
                const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
                var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
                collector.on("collect", (reaction, user) => {
                    if (collector && !collector.ended) collector.stop();
                    switch (reaction.emoji.name) {
                        case "✅":
                            reaction.users.remove(user).catch(console.error);
                            member.roles.add(muteRole.id).catch(x => {
                                return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Because: ${x}`)).then(msg => { msg.delete({ timeout: 10000 }) })
                            })
                            react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to mute **\`${member.user.tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
                            return message.channel.activateCollector = false
                            break;

                        case "❎":
                            reaction.users.remove(user).catch(console.error);
                            react.edit(createEmbed("error", `<a:no:765207855506522173> | Operation to mute **\`${member.user.tag}\`** has canceled!`)).then(msg => { msg.delete({ timeout: 10000 }) })
                            return message.channel.activateCollector = false
                            break;

                        default:
                            reaction.users.remove(user).catch(console.error);
                            break;
                    }
                });
                collector.on("end", () => {
                    react.reactions.removeAll().catch(console.error);
                    return message.channel.activateCollector = false
                });
            } catch (e) {
                console.log(e);
                return message.channel.activateCollector = false
            }
        } catch (e) {
            message.channel.send(e.message)
            console.log(e)
        }
    }
}
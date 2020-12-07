const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "member",
    aliases: [""],
    category: "Administration",
    descriptions: "Setting member",
    usage: "member <member[mention/id]> <argumen>",
    options: ["--mute", "--unmute", "--kick", "--ban"],
    cooldown: "",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
        if (!member) {
            const e = new MessageEmbed()
                .setColor('RED')
                .setDescription(`\`\`\`md\nUsage: m!member <member[mention/id]> <argumen>\nArgumen Options: \n* <--mute>, <--unmute>, <--kick>, <--ban>\nExample: m!member 1234567890 [reason] <--ban>\n\`\`\``)
                .setFooter(`Note: Don't input <> or []. It's meaning <> is required and [] is optional`)
            return message.channel.send(e)
        }
        if (!message.guild.me.hasPermission('KICK_MEMBERS' || 'BAN_MEMBERS' || 'MANAGE_ROLES' || 'ADMINISTRATOR')) return message.channel.send(`I need permissions for **\`KICK_MEMBERS\`** or **\`BAN_MEMBERS\`** or **\`MANANGE_ROLES\`** or **\`ADMINISTRATOR\`**`)
        if (!message.member.hasPermission('KICK_MEMBERS' || 'BAN_MEMBERS' || 'MANAGE_ROLES' || 'ADMINISTRATOR')) return message.channel.send(`You need permissions for **\`KICK_MEMBERS\`** or **\`BAN_MEMBERS\`** or **\`MANANGE_ROLES\`** or **\`ADMINISTRATOR\`**`)

        let reason = args.slice(1).join(' ');
        if (!reason) {
            reason = " - ";
        }
        else {
            reason = `${reason}`
        }

        if (
            message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0
        ) {
            return message.channel.send(
                `My Highest role must be higher than **\`${member.user.username}\`** highest role!`
            );
        }

        if (message.content.includes('--mute')) {
            if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(`This member has permission **\`ADMINISTRATOR\`**`)
            try {
                let muteRole = message.guild.roles.cache.find(r => r.name === "MunaMute");
                if (!muteRole) {
                    try {
                        muteRole = await message.guild.roles.create({
                            data: {
                                name: "MunaMute",
                                color: "#514f48",
                                permissions: []
                            }
                        });
                    } catch (e) {
                        console.log(e.stack);
                    }
                }

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

                if (member.roles.cache.some(r => muteRole.id === r.id)) {
                    return message.channel.send(`${member} Has been muted`);
                }
                try {
                    var react = await message.channel.send(
                        `Are you sure to Muted **\`${member.user.tag}\`**?`
                    );
                    await react.react("✅");
                    await react.react("❎");
                    const filter = (reaction, user) =>
                        user.id !== message.client.user.id && user.id === message.author.id;
                    var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
                    collector.on("collect", (reaction, user) => {
                        if (collector && !collector.ended) collector.stop();
                        switch (reaction.emoji.name) {
                            case "✅":
                                reaction.users.remove(user).catch(console.error);
                                react.edit(
                                    `<a:yes:765207711423004676> | Muted **\`${member.user.tag}\`** successful!`
                                );
                                member.roles.add(muteRole.id);
                                break;

                            case "❎":
                                reaction.users.remove(user).catch(console.error);
                                react.edit(
                                    `<a:no:765207855506522173> | Muted **\`${member.user.tag}\`** has canceled!`
                                );
                                break;

                            default:
                                reaction.users.remove(user).catch(console.error);
                                break;
                        }
                    });
                    collector.on("end", () => {
                        react.reactions.removeAll().catch(console.error);
                    });
                } catch (e) {
                    console.log(e);
                }
            } catch (e) {
                message.channel.send(e.message)
                console.log(e)
            }
        } else if (message.content.includes('--unmute')) {
            let muterole = message.guild.roles.cache.find(r => r.name === 'MunaMute');
            if (!member.roles.cache.some(r => muterole.id === r.id)) {
                return message.channel.send(`${member} wasn't muted now`);
            }
            try {
                var react = await message.channel.send(`Are you sure to unmute **\`${member.user.tag}\`**?`);
                await react.react('✅');
                await react.react('❎');
                const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
                var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
                collector.on('collect', (reaction, user) => {
                    if (collector && !collector.ended) collector.stop();
                    switch (reaction.emoji.name) {
                        case "✅":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:yes:765207711423004676> | Unmuted user **\`${member.user.tag}\`** successful!`)
                            member.roles.remove(muterole.id)
                            break;

                        case "❎":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:no:765207855506522173> | Unmuted user **\`${member.user.tag}\`** has canceled!`)
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
            }
        } else if (message.content.includes('--kick')) {
            if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(`This member has permission **\`ADMINISTRATOR\`**`)

            if (!member.kickable) return message.channel.send("This member is not kickable");
            
            if (member.user.id === message.author.id) {
                return message.channel.send(`You can't kicked yourself`)
            }
            if (member.user.id === message.client.user.id) {
                return message.channel.send(`I can't kick myself`)
            }

            try {
                var react = await message.channel.send(`Are you sure to Kick **\`${member.user.tag}\`**?`);
                await react.react('✅');
                await react.react('❎');
                const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
                var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
                collector.on('collect', (reaction, user) => {
                    if (collector && !collector.ended) collector.stop();
                    switch (reaction.emoji.name) {
                        case "✅":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:yes:765207711423004676> | Kicked **\`${member.user.tag}\`** successful!`)
                            member.kick(reason.replace('--kick', '')).catch(e => message.channel.send(`Sorry i couldn't kick this user because ${e}`))
                            break;

                        case "❎":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:no:765207855506522173> | Kicked **\`${member.user.tag}\`** has canceled!`)
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
            }
        } else if (message.content.includes('--ban')) {
            if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(`This member has permission **\`ADMINISTRATOR\`**`)

            if (!member.kickable) return message.channel.send("This member is not banable");

            if (member.user.id === message.author.id) {
                return message.channel.send(`You can't banned yourself`)
            }
            if (member.user.id === message.client.user.id) {
                return message.channel.send(`I can't banned me`)
            }

            try {
                var react = await message.channel.send(`Are you sure to ban **\`${member.user.tag}\`**?`);
                await react.react('✅');
                await react.react('❎');
                const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
                var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
                collector.on('collect', (reaction, user) => {
                    if (collector && !collector.ended) collector.stop();
                    switch (reaction.emoji.name) {
                        case "✅":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:yes:765207711423004676> | Banned **\`${member.user.tag}\`** successful!`)
                            member.ban({ reason: reason.replace('--ban', '') }).catch(e => message.channel.send(`Sorry i couldn't ban this user because ${e}`))
                            break;

                        case "❎":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:no:765207855506522173> | Banned **\`${member.user.tag}\`** has canceled!`)
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
            }
        }
    }
}
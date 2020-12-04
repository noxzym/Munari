const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: "channel",
    aliases: ["ch"],
    category: "Administration",
    descriptions: "Setting channel",
    usage: "ch <options>",
    options: ["--lock", "--unlock"],
    cooldown: "",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        if (!message.guild.me.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`I need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`)
        if (!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`You need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`)

        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first() || message.channel
        const e = new MessageEmbed()
        .setColor('RED')
        .setDescription(`\`\`\`md\nUsage: m!channel <channel[mention/id]> <argumen>\nArgumen Options: \n* <--lock>, <--unlock>\nExample: m!channel #general <--lock>\n\`\`\``)
        if (!channel) return message.channel.send(e)

        if (message.content.includes('--lock')) {
            try {
                var react = await message.channel.send(`Are you sure to Lock Channel **\`${channel.name}\`**?`);
                await react.react('✅');
                await react.react('❎');
                const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
                var collector = react.createReactionCollector(filter, { time: 20000 });
                collector.on('collect', (reaction, user) => {
                    if (collector && !collector.ended) collector.stop();
                    switch (reaction.emoji.name) {
                        case "✅":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:yes:765207711423004676> | Locked Channel **\`${channel.name}\`** successful!`)
                            channel.updateOverwrite(message.guild.id, {
                                SEND_MESSAGES: false,
                            });
                            message.channel.send(`Channel ${channel.name} has locked now`)
                            break;

                        case "❎":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:no:765207855506522173> | Locked Channel **\`${channel}\`** has canceled!`)
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
        } else if (message.content.includes('--unlock')) {
            try {
                var react = await message.channel.send(`Are you sure to Unlock Channel **\`${channel.name}\`**?`);
                await react.react('✅');
                await react.react('❎');
                const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
                var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
                collector.on('collect', (reaction, user) => {
                    if (collector && !collector.ended) collector.stop();
                    switch (reaction.emoji.name) {
                        case "✅":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:yes:765207711423004676> | Unocked Channel **\`${channel.name}\`** successful!`)
                            channel.updateOverwrite(message.guild.id, {
                                SEND_MESSAGES: true,
                            });
                            message.channel.send(`channel ${channel.name} has unlocked now!`)
                            break;

                        case "❎":
                            reaction.users.remove(user).catch(console.error)
                            react.edit(`<a:no:765207855506522173> | Unlocked Channel **\`${channel}\`** has canceled!`)
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
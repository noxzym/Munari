const { createEmbed } = require("../../utils/Function");

module.exports = {
    name: "unlock",
    aliases: [""],
    category: "Moderation",
    descriptions: "",
    usage: "Unlock the channel from everyone",
    options: [""],
    cooldown: "10",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first()
        if (!channel) return message.channel.send(`You need to mention channel first`).then(x => { x.delete({ timeout: 10000 }) })

        if (!message.guild.me.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`I need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        if (!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`You need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        if (message.channel.activateCollector === true) return message.channel.send("please wait until the timeout over or response has given").then(msg => { msg.delete({ timeout: 5000 }) });

        if (channel.permissionsFor(message.guild.id).has('SEND_MESSAGES')) return message.channel.send(`<a:yes:765207711423004676> | Channel **\`${channel.name}\`** not Locked`).then(x => { x.delete({ timeout: 10000 }) })
        
        try {
            var react = await message.channel.send(createEmbed("info", `Are you sure to Unlock Channel **\`${channel.name}\`**?`))
            message.channel.activateCollector = true
            await react.react('✅');
            await react.react('❎');
            const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
            var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
            collector.on('collect', (reaction, user) => {
                if (collector && !collector.ended) collector.stop();
                switch (reaction.emoji.name) {
                    case "✅":
                        reaction.users.remove(user).catch(console.error)
                        react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Unocked Channel **\`${channel.name}\`** successful!`)).then(x => { x.delete({ timeout: 10000 }) })
                        channel.updateOverwrite(message.guild.id, {
                            SEND_MESSAGES: null,
                            ADD_REACTIONS: null
                        })
                        return message.channel.activateCollector = false
                        break;

                    case "❎":
                        reaction.users.remove(user).catch(console.error)
                        react.edit(createEmbed("error", `<a:no:765207855506522173> | Unlocked Channel **\`${channel.name}\`** has canceled!`)).then(x => { x.delete({ timeout: 10000 }) })
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
            react.reactions.removeAll().catch(console.error);
            return message.channel.activateCollector = false
        }
    }
}
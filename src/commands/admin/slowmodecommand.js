const { createEmbed, formatMs } = require('../../utils/Function')
const ms = require('ms')

module.exports = {
    name: "slowmode",
    aliases: ["slowmo", "ratelimit"],
    category: "Moderation",
    descriptions: "Set ratelimit user",
    usage: "slowmode <channel[mention/id]>",
    options: [""],
    cooldown: "10",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first()
        if (!channel) return client.commandmanager.command.get("help").run(client, message, [this.name]).then(x => { x.delete({ timeout: 10000 }) })

        if (!message.guild.me.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`I need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        if (!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`You need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        if (message.channel.activateCollector === true) return message.channel.send("please wait until the timeout over or response has given").then(msg => { msg.delete({ timeout: 5000 }) });

        let number = ms(args[1])
        let nums = formatMs(number)
        
        if (!number) return message.channel.send(`Please provide the time to slowmode channel **\`${channel.name}\`**`).then(x => { x.delete({ timeout: 10000 }) })
        if (isNaN(number)) return message.channel.send(`Please input the correct number in second`).then(x => { x.delete({ timeout: 10000 }) })
        if (number > 518400000) return message.channel.send(`Maximal number is 518400 second or 6 hours`).then(x => { x.delete({ timeout: 10000 }) })
        if (number < 0) return message.channel.send(`Minimal number is 0 second`).then(x => { x.delete({ timeout: 10000 }) })

        try {
            var react = await message.channel.send(createEmbed("info", `Are you sure to set ratelimit Channel **\`${channel.name}\`** for **\`${nums}\`** ?`))
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
                        react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Set ratelimit Channel **\`${channel.name}\`** successful!`)).then(x => { x.delete({ timeout: 10000 }) })
                        channel.setRateLimitPerUser(number)
                        return message.channel.activateCollector = false
                        break;

                    case "❎":
                        reaction.users.remove(user).catch(console.error)
                        react.edit(createEmbed("error", `<a:no:765207855506522173> | Set ratelimit Channel **\`${channel.name}\`** has canceled!`)).then(x => { x.delete({ timeout: 10000 }) })
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
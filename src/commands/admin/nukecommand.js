const { createEmbed } = require("../../utils/Function");

module.exports = {
    name: "nuke",
    aliases: ["nuclear"],
    category: "Moderation",
    descriptions: "Clear all ecosystem on the channel",
    usage: "nuke <channel[mention/id]>",
    options: null,
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if (!channel) return message.channel.send(`You need to mention channel first`).then(x => { x.delete({ timeout: 10000 }) })

        if (!message.guild.me.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`I need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        if (!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`You need permissions for **\`MANAGE_CHANNELS\`** or **\`ADMINISTRATOR\`**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        if (message.channel.activateCollector === true) return message.channel.send("please wait until the timeout over or response has given").then(msg => { msg.delete({ timeout: 5000 }) });

        try {
            var react = await message.channel.send(createEmbed("info", `Are you sure to Nuke Channel **\`${channel.name}\`**?`));
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
                        react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Nuke Channel **\`${channel.name}\`** successful!`)).then(X => { x.delete({ timeout: 3000 }) })
                        channel.clone().then(x => {
                            message.guild.channels.cache.get(x.id).send(
                                createEmbed("info").setAuthor(`Nothing in here, Nuke command successful!`, client.user.avatarURL()).setImage("https://cdn.discordapp.com/attachments/795512730940735508/801765196989071390/explosion.gif").setTimestamp().setFooter(`Commanded by: ${message.author.tag}`, client.user.avatarURL({ dynamic: true }))
                            ).then(x => { x.delete({ timeout: 10000 }) })
                        })
                        setTimeout(() => {
                            channel.delete(`Nuke Command Successful!`)
                        }, 2000);
                        return message.channel.activateCollector = false
                        break;

                    case "❎":
                        reaction.users.remove(user).catch(console.error)
                        react.edit(createEmbed("error", `<a:no:765207855506522173> | Nuke Channel **\`${channel.name}\`** has canceled!`)).then(x => { x.delete({ timeout: 10000 }) })
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
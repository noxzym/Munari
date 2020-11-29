module.exports = {
    name: "nuke",
    aliases: [""],
    category: "Administration",
    descriptions: "Recreate channel",
    usage: "nuke [channel[mention/id]]",
    options: [""],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        if (!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`You couldn't have permissions \`MANAGE_CHANNELS\` or \`ADMINISTRATOR\``)
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`I couldn't have permissions \`MANAGE_CHANNELS\``)
        const channel = message.guild.channels.cache.get(message.mentions.channels.first().id) || message.mentions.channels.first() || message.channel
        try {
        var msg = await message.channel.send(`Are you sure to nuke channel **\`${channel.name}\`**`)
        await msg.react("✅");
        await msg.react("❎");
        const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
        var collector = msg.createReactionCollector(filter, { max: 1, time: 15000, errors: ["time"] });
        collector.on("collect", (reaction, user) => {
            if (collector && !collector.ended) collector.stop();
            switch (reaction.emoji.name) {
                case "✅":
                    reaction.users.remove(user).catch(console.error);
                    await channel.clone().then(x => x.channel.send('<a:yes:765207711423004676> | Nuke command succesful!'))
                    await channel.delete()
                    break;

                case "❎":
                    reaction.users.remove(user).catch(console.error);
                    msg.edit(
                        `<a:no:765207855506522173> | Nuke channel **\`${channel.name}\`** has canceled!`
                    );
                    break;

                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        });
        collector.on("end", () => {
            msg.reactions.removeAll().catch(console.error);
        });
    } catch(e) {
        console.log(e);
    }        
    }
}
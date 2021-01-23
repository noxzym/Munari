const { MessageEmbed, Collection } = require('discord.js')
const { formatMs, createEmbed } = require('../utils/Function')
module.exports = {
    name: 'message',
    async run(client, message) {

        //Prefix In Here\\
        const prefix = client.config.prefix;
        const getpref = new RegExp(`^<@!?${client.user.id}>( |)$`);

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(`Munari Help`)
            .setThumbnail(`${client.user.avatarURL()}`)
            .setDescription(`My prefix is **\`m!\`**\n\nUse **\`m!help\`** to get command list\n**[[INVITE ME](https://top.gg/bot/740112353483554858/invite)] [[VOTE ME](https://top.gg/bot/740112353483554858/vote)]**`)
        if ((message.guild !== null && !message.guild.me.hasPermission('SEND_MESSAGES'))) return
        if (message.channel.type !== 'dm' && !message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return
        if (message.author.bot) return
        if (message.content.match(getpref)) return message.channel.send(embed);

        if (!message.content.startsWith(prefix)) return

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();

        //Command Files in HERE
        let command = client.commandmanager.command.get(cmd) || client.commandmanager.command.get(client.commandmanager.aliases.get(cmd));
        if (!command) return;

        //Owner Only
        if (command.ownerOnly && message.author.id !== "243728573624614912") return

        //GuildOwnly
        if (command.guildOnly && message.channel.type === 'dm') return

        //Cooldown command in here
        const cooldown = client.commandmanager.cooldown;
        !cooldown.has(command.name) ? cooldown.set(command.name, new Collection()) : null

        const now = Date.now();
        const timestamps = cooldown.get(command.name);
        const cooldownamount = command.cooldown * 1000;

        if (timestamps.has(message.author.id)) {
            const expiration = timestamps.get(message.author.id) + cooldownamount;
            if (now < expiration) {
                const timeleft = formatMs((expiration - now));
                return message.channel.send(createEmbed("error", `Oof! you hit the cooldown. Please wait **\`${timeleft}\`** to use this command again`)).then(x => { x.delete({ timeout: 5000 }) });
            }
        };

        timestamps.set(message.author.id, now);
        message.author.id === "243728573624614912" ? timestamps.delete(message.author.id) : setTimeout(() => { timestamps.delete(message.author.id) }, cooldownamount);

        //Execute command in here
        try {
            await command.run(client, message, args);
        } catch (err) {
            console.error(err)
        } finally {
            console.log(`${message.author.tag} •> ${command.name} <•> ${message.guild.name} <•> #${message.channel.name}`)
        }
    }
}
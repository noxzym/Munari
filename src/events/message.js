const { MessageEmbed, Collection } = require('discord.js')
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

        let args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g);
        let cmd = args.shift().toLowerCase();
        if (!cmd) return

        //Command Files in HERE
        let command =
            client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;

        //Owner Only
        if (command.ownerOnly && message.author.id !== "243728573624614912") {
            return
        }

        //GuildOwnly
        if (command.guildOnly && message.channel.type === 'dm') {
            return
        }

        //Cooldown command in here
        const cooldowns = client.cooldowns
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                    .then(msg => { msg.delete({ timeout: 5000 }); });
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        if (message.member.id === "243728573624614912") {
            timestamps.delete(message.author.id, now);
        }

        //Execute command in here
        if (command)
            try {
                command.run(client, message, args);
            } catch (err) {
            } finally {
                console.log(
                    `${message.author.tag} menggunakan command ${prefix}${cmd} di server ${message.guild.name} channel #${message.channel.name}`
                );
            }
    }
}
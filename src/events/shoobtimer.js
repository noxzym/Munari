const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'message',
    async run(client, message) {
        try {
            let embed = message.embeds[0];
            if (
                message.guild.id !== '733474234600521850' &&
                message.author.id === "673362753489993749" &&
                embed &&
                embed.title &&
                embed.title.includes("Tier") &&
                embed.image
            ) {
                var i = 15;
                let e = new MessageEmbed()
                var time = await message.channel.send({ embed: e.setDescription(`:green_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#78b159') })
                var interval = setInterval(function () {
                    i = i - 5;
                    if (i === 0) {
                        clearInterval(interval)
                        time.edit({ embed: e.setDescription(`:black_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#31373d') }).then(x => { x.delete({ timeout: 3000 }) })
                    }
                    if (i === 5) {
                        time.edit({ embed: e.setDescription(`:red_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#dd2e44') })
                    }
                    if (i === 10) {
                        time.edit({ embed: e.setDescription(`:yellow_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#fdcb58') })
                    }
                    if (i === 15) {
                        time.edit({ embed: e.setDescription(`:green_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#78b159') })
                    }
                }, 5000);
            }
        } catch (e) {
            return message.channel.send(e)
        }
    }
}
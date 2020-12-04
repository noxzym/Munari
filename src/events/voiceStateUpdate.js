const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'voiceStateUpdate',
    async run(client, oldState, newState) {
        // if (oldState.channel && oldState.channel.members.size === 1 && oldState.channelID === oldState.guild.voice.channelID) {
        //     const channel = client.queue.get(message.guild.id).textChannel
        //     const e = new MessageEmbed()
        //         .setColor('RED')
        //         .setDescription(`I will disconnect if no users join my voice channel after 1 menutes`)
        //     var em = await channel.send(e)
        //     setTimeout(() => {
        //         oldState.channel.leave()
        //         em.delete({timeout: 2000})
        //     }, 60000)
        // }
    }
}
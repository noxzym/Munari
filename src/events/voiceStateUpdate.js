const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'voiceStateUpdate',
    async run(client, oldState, newState) {
        // if (oldState.channel === null) return newState.setSelfDeaf(true);
        // let change = false;
        // const queue = client.queue.get(newState.guild.id);
        // if (!queue) return;
        // if (newState.member.id === client.user.id && oldState.member.id === client.user.id) {
        //     if (newState.member.voice.channel === null) {
        //         queue.songs = [];
        //         queue.loop = false;
        //         return client.queue.delete(newState.guild.id);
        //     }
        //     if (newState.member.voice.channel !== queue.voiceChannel) {
        //         change = true;
        //         queue.voiceChannel = newState.member.voice.channel;
        //         queue.connection = newState.connection;
        //     }
        // }
        // if (oldState.channel.members.size === 1 && oldState.channel === queue.voiceChannel || change) {
        //     queue.textChannel.send(`I will disconnect if i alone in my voice channel`)
        //     setTimeout(() => {
        //         if (!queue || !queue.connection.dispatcher || queue.connection.dispatcher === null) return;
        //         if (queue.voiceChannel.members.size === 1) {
        //             queue.textChannel.send(`I have left the channel as i was left alone.`);
        //             queue.connection.dispatcher.end();
        //         }
        //     }, 60000);
        // }
    }
}
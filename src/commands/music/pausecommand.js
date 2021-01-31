module.exports = {
  name: "pause",
  aliases: null,
  category: "Music",
  descriptions: "Pause the currently songs",
  usage: "stop",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  run: async function (client, message, args) {
    const queue = client.queue.get(message.guild.id)
    if (!queue) return message.inlineReply("There is nothing playing.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

    if (queue.playing) {

      try {
        const { channel } = message.member.voice;
        if (!channel) return message.inlineReply(`Please join voice channel first`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
          return message.inlineReply(`You must in my voice channel`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        }

        queue.playing = false
        
        await queue.connection.dispatcher.pause(true);
        return client.channels.cache.get(queue.textChannel).send(`<a:yes:765207711423004676> | ${message.author} has paused the music!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      } catch (e) {
        console.error();
        message.channel.send(`Sorry i get ${e} when execute this command`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
      }

    } else {
      return message.inlineReply(`Song is not playing right now`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }
    
  }
};

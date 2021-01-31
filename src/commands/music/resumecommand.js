module.exports = {
  name: "resume",
  aliases: null,
  category: "Music",
  descriptions: "Resume currently playing music",
  usage: "resume",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  run: async function(client, message, args) {
    const queue = client.queue.get(message.guild.id)
    if (!queue) return message.inlineReply("There is nothing playing.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

    if (!queue.playing) {

      try {
        const { channel } = message.member.voice;
        if (!channel) return message.inlineReply(`Please join voice channel first`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
          return message.inlineReply(`You must in my voice channel`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        }

        queue.playing = true
        await queue.connection.dispatcher.resume(true);
        return client.channels.cache.get(queue.textChannel).send(`<a:yes:765207711423004676> | ${message.author} has resumed the music!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

      } catch (e) {

        console.error();
        message.channel.send(`Sorry i get ${e} when execute this command`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

      }

    } else {
      return message.inlineReply("The queue is not paused.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
    }
    
  }
};

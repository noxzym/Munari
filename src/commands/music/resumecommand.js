module.exports = {
  name: "resume",
  aliases: [""],
  category: "Music",
  descriptions: "Resume currently playing music",
  usage: "resume",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  run: async function(client, message, args) {
    const queue = client.queue.get(message.guild.id)
    if (!queue) return message.reply("There is nothing playing.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

    if (!queue.playing) {

      try {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(`Please join voice channel first`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
          return message.channel.send(`You must in my voice channel`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        }

        queue.playing = true
        await queue.connection.dispatcher.resume(true);
        return queue.textChannel.send(`<a:yes:765207711423004676> | ${message.author} has resumed the music!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      } catch (e) {
        console.error();
        message.channel.send(`Sorry i get ${e} when execute this command`)
      }

    } else {
      return message.reply("The queue is not paused.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
    }
    
  }
};

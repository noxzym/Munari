module.exports = {
  name: "resume",
  aliases: [""],
  category: "Music",
  descriptions: "Resume currently playing music",
  usage: "resume",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function(client, message, args) {
    try {
      const { channel } = message.member.voice;
      const botChannel = message.member.guild.me.voice.channel;
      const playing = queue.playing

      if (channel !== botChannel) {
        return message.reply("You need to join the voice channel first!").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      }
      const queue = client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

      if (playing = false) {
        queue.playing = true;
        queue.connection.dispatcher.resume(true);
        return queue.textChannel.send(`<a:yes:765207711423004676> | ${message.author} has resumed the music!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      } else {
        return message.reply("The queue is not paused.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      }
    } catch (e) {
      console.log(e)
    }
  }
};

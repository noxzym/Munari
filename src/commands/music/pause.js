module.exports = {
  name: "pause",
  aliases: [""],
  category: "Music",
  descriptions: "Pause the currently songs",
  usage: "stop",
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

      if (playing = true) {
        playing = false;
        queue.connection.dispatcher.pause(true);
        return queue.textChannel.send(`<a:yes:765207711423004676> | ${message.author} has paused the music!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      } else {
        queue.textChannel.send(`Song is not playing now`)
      }
    } catch (e) {
      console.log(e)
    }
  }
};

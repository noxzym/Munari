module.exports = {
  name: "stop",
  aliases: [""],
  category: "Music",
  descriptions: "Stop the music and clear queue",
  usage: "stop",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function (client, message, args) {
    const { channel } = message.member.voice;
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

    try {
      if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to stop the song`).then(msg => { msg.delete({ timeout: 8000 }); });
      }

      queue.songs = [];
      queue.connection.dispatcher.end();
      queue.textChannel.send(`<a:yes:765207711423004676> | ${message.author} has stopped the music!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

    } catch (e) {
      console.log(e)
    }
  }
};
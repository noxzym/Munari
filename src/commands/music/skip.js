module.exports = {
  name: "skip",
  aliases: ["s"],
  category: "Music",
  descriptions: "Skip the currently playing song",
  usage: "skip",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    try {
      const { channel } = message.member.voice;
      const botChannel = message.member.guild.me.voice.channel;

      if (channel !== botChannel) {
        return message.reply("You need to join the voice channel first!").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
      }
      const queue = client.queue.get(message.guild.id);
      if (!queue)
        return message.reply("There is nothing playing that I could skip for you.").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`<a:yes:765207711423004676> | ${message.author} has skipped the song`).then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
    } catch (e) {
      console.log(e)
    }
    
  }
};

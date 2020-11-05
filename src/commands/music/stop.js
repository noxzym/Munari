module.exports = {
  name: "stop",
  aliases: [""],
  category: "Music",
  descriptions: "Stop the music and clear queue",
  usage: "stop",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  run: async function(client, message, args) {
    const queue = client.queue.get(message.guild.id);
    
    try {
          const { channel } = message.member.voice;
    const botChannel = message.member.guild.me.voice.channel;

    if (channel !== botChannel) {
      return message.reply("You need to join the voice channel first!").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
    }
      
    if (!queue) return message.reply("There is nothing playing.").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`<a:yes:765207711423004676> | ${message.author} has stopped the music!`).then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
    } catch (e) {
      console.log(e)
    }
  }
};

module.exports = {
  name: "remove",
  aliases: [""],
  category: "Music",
  descriptions: "Remove song from queue",
  usage: "remove <song number>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function(client, message, args) {
    try {
      const { channel } = message.member.voice;
      const botChannel = message.member.guild.me.voice.channel;

      if (channel !== botChannel) {
        return message.reply("You need to join the voice channel first!").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
      }
      const queue = client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
        
    const prefix = 'm!'
    if (!queue) return message.channel.send("There is no queue.").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
    
    if (!args.length && isNaN(args[0])) return message.reply(prefix + this.usage);
    const song = queue.songs.splice(args[0] + 1, 1);
    queue.textChannel.send(`<a:yes:765207711423004676> | Remove ${song[0].title} from queue Successful!`).then(msg=>{msg.delete({timeout: 5000})});
      
      }catch (e) {
        console.log(e)
      }
  }
};

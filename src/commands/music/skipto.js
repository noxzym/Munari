const Prefix = require('discord-prefix')
module.exports = {
  name: "skipto",
  aliases: ["st"],
  category: "Music",
  descriptions: "Skip to the selected queue number",
  usage: "skiptp <number queue>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
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
      
      const amount = args.join(' ')
      const prefix = Prefix.getPrefix(message.guild.id) || 'm!'
      
      if (!args.length)
        return message.reply(prefix + this.usage)

      if (isNaN(amount))
        return message.reply('Please input number queue')
      
      if (amount < 2) return;
      if(amount > queue.songs.length) return message.reply(`The queue only have ${queue.songs.length} Songs!`).then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
      
      queue.playing = true;
      if (queue.loop) {
        for (let i = 0; i < amount - 2; i++) {
          queue.songs.push(queue.songs.shift());
        }
      } else {
        queue.songs = queue.songs.slice(amount - 2);
      }
      queue.connection.dispatcher.end();
      queue.textChannel.send(`<a:yes:765207711423004676> | ${message.author} has skipped ${amount - 1} songs`).catch(console.error);
    }catch(e) {
      console.log(e)
    }
  }
};

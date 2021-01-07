module.exports = {
  name: "skipto",
  aliases: ["st"],
  category: "Music",
  descriptions: "Skip to the selected queue number",
  usage: "skiptp <number queue>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    try {
      const { channel } = message.member.voice;
      if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to skip the song`).then(msg => { msg.delete({ timeout: 8000 }); });
      }
      const queue = client.queue.get(message.guild.id);
      if (!queue)
        return message.reply("There is nothing playing that I could skip for you.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

      const amount = args.join(' ')
      if (!args.length)
        return message.reply(client.config.prefix + this.usage)

      if (isNaN(amount))
        return message.reply('Please input number queue')

      if ( amount < 1 ) return message.channel.send(`Please input the correct song number`)

      if (amount > queue.songs.length) return message.reply(`The queue only have ${queue.songs.length} Songs!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

      queue.playing = true;
      if (queue.loop) {
        for (let i = 0; i < amount - 1; i++) {
          queue.songs.push(queue.songs.shift());
        }
      } else {
        queue.songs = queue.songs.slice(amount - 1);
      }
      queue.connection.dispatcher.end();
      client.channels.cache.get(queue.textChannel).send(`<a:yes:765207711423004676> | ${message.author} has skipped ${amount - 1} songs`).catch(console.error);
    } catch (e) {
      console.log(e)
    }
  }
};

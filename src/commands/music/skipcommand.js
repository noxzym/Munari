module.exports = {
  name: "skip",
  aliases: ["s"],
  category: "Music",
  descriptions: "Skip the currently playing song",
  usage: "skip",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    try {
      const { channel } = message.member.voice;
      if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
        return message.inlineReply(`You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to skip the song`).then(msg => { msg.delete({ timeout: 8000 }); });
      }
      const queue = client.queue.get(message.guild.id);
      if (!queue)
        return message.inlineReply("There is nothing playing that I could skip for you.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

      queue.playing = true;
      queue.connection.dispatcher.end();
      client.channels.cache.get(queue.textChannel).send(`<a:yes:765207711423004676> | ${message.author} has skipped the song`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
    } catch (e) {
      console.log(e)
    }

  }
};

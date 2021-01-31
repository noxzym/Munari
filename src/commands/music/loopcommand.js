module.exports = {
  name: "loop",
  aliases: null,
  category: "Music",
  descriptions: "Looping currently queue list",
  usage: "loop",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  run: async function (client, message, args) {
    try {

      const { channel } = message.member.voice;
      if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to loop the song`).then(msg => { msg.delete({ timeout: 8000 }); });
      }

      const queue = client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

      queue.loop = !queue.loop;

      return client.channels.cache.get(queue.textChannel)
        .send(`<a:yes:765207711423004676> | Loop is now ${queue.loop ? `**\`On\`**` : `**\`Off\`**`}`).then(msg => { msg.delete({ timeout: 5000 }) })
        .catch(console.error);
        
    } catch (e) {
      console.log(e)
    }
  }
};

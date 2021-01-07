module.exports = {
  name: "volume",
  aliases: ["v"],
  category: "Music",
  descriptions: "Change volume of music songs",
  usage: "volume <set volume [1 - 100]>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function (client, message, args) {
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);

    try {
      const { channel } = message.member.voice;
      const botChannel = message.member.guild.me.voice.channel;

      if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to set the volume`).then(msg => { msg.delete({ timeout: 8000 }); });
      }

      if (!args[0]) return message.reply(`🔊 The current volume is: **${queue.volume}%**`).catch(console.error);

      if (/^([1-9]?\d|100)$/.test(args[0]) === false) {
        return message.reply("Please use a number between 0 - 100.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      }

      queue.volume = args[0];
      queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

      client.channels.cache.get(queue.textChannel).send(`Volume set to: **${args[0]}%**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

    } catch (e) {
      console.log(e)
      message.channel.send(e.message)
    }
  }
};

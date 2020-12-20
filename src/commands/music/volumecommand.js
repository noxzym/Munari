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

    try {
      const { channel } = message.member.voice;
      const botChannel = message.member.guild.me.voice.channel;

      if (channel !== botChannel) {
        return message.reply("You need to join the voice channel first!").then(msg => { msg.delete({ timeout: 8000 }) }).catch(console.error);
      }

      if (!queue) return message.reply("There is nothing playing.").catch(console.error);

      if (!args[0]) return message.reply(`🔊 The current volume is: **${queue.volume}%**`).catch(console.error);

      if (/^[0-9][1-9]?$|^100$/.test(args[0]) === false) {
        return message.reply("Please use a number between 0 - 100.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      } else {

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

        queue.textChannel.send(`Volume set to: **${args[0]}%**`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      }
    } catch (e) {
      console.log(e)
      message.channel.send(e.message)
    }
  }
};

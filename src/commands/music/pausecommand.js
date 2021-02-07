const { createEmbed } = require("../../utils/Function")

module.exports = {
  name: "pause",
  aliases: null,
  category: "Music",
  descriptions: "Pause the currently songs",
  usage: "stop",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const queue = message.guild.queue
    if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }))
    const { channel } = message.member.voice;
    if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }))
    if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to pause the music")).then(x => x.delete({ timeout: 10000 }))

    if (!queue.playing) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. I can't pause the music if music has been paused`)).then(x => x.delete({ timeout: 10000 }))

    client.player.pause(message)
    message.channel.send(createEmbed("info", `**\`${message.author.username}\` has paused the music!**`)).then(x => x.delete({ timeout: 10000 }))


  }
};

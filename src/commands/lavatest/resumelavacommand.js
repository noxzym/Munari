const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
  name: "resumelava",
  aliases: null,
  category: "Developer",
  descriptions: "resume the current playing",
  usage: "resume",
  options: null,
  cooldown: "5",
  ownerOnly: true,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const queue = message.guild.queue
    if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }))
    const { channel } = message.member.voice;
    if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }))
    if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to resume the music")).then(x => x.delete({ timeout: 10000 }))

    if (queue.playing) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. I can't resume the music if music is not paused`)).then(x => x.delete({ timeout: 10000 }))

    await client.shoukaku.resume(message)
    return message.channel.send(createEmbed("info", `**The current song has been resume by \`${message.author.username}\`**`))
  }
};
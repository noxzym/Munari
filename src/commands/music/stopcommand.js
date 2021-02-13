const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
  name: "stop",
  aliases: null,
  category: "Music",
  descriptions: "Stop the music and clear queue",
  usage: "stop",
  options: null,
  cooldown: "5",
  ownerOnly: false,
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
    if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to stop the music")).then(x => x.delete({ timeout: 10000 }))

    await client.player.stop(message)
    message.channel.send(createEmbed("info", `**Music has been stopped by \`${message.author.username}\`**`)).then(x => x.delete({ timeout: 10000 }))

  }
};

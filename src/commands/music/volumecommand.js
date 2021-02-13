const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
  name: "volume",
  aliases: ["v"],
  category: "Music",
  descriptions: "Change volume of music songs",
  usage: "volume <set volume [1 - 100]>",
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
    if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to set the volume")).then(x => x.delete({ timeout: 10000 }))
    if (!args.length) return message.channel.send(createEmbed("info", `🔊The current volume is **\`${queue.volume}\`**`)).then(x => x.delete({ timeout: 10000 }))

      if (/^([1-9]?\d|100)$/.test(args[0])) {

        client.player.setVolume(message, args[0])
        message.channel.send(createEmbed("info", `**Volume has been change to \`${args[0]}\`**`)).then(x => x.delete({ timeout: 10000 }))

      } else {
        message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Please input a valid number between 1 - 100")).then(x => x.delete({ timeout: 10000 }))
      }
  }
};

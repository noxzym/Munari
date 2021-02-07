const { createEmbed } = require("../../utils/Function")

module.exports = {
  name: "remove",
  aliases: null,
  category: "Music",
  descriptions: "Remove song from queue",
  usage: "remove <song number>",
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
    if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to remove the music")).then(x => x.delete({ timeout: 10000 }))

    if (!args.length) return client.commandmanager.command.get('help').run(client, message, [this.name])
    if (isNaN(args[0])) return;
    if (args[0] < 1 || args[0] > queue.songs.length - 1) return;

    const song = queue.songs.splice(args[0], 1);
    message.channel.send(createEmbed("info", `**\`${song[0].title}\` has been removed from queue**`)).then(x => x.delete({ timeout: 10000 }))

  }
};
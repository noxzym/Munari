const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  category: "Music",
  descriptions: "Skip to the selected queue number",
  usage: "skipto <number queue>",
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
    if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to skip the music")).then(x => x.delete({ timeout: 10000 }))

    if (!args.length) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You need to input song number")).then(x => x.delete({ timeout: 10000 }))
    if (isNaN(args[0])) return message.channel.send(createEmbed("info", 'Please input the correct number'))
    if (args[0] < 1) return message.channel.send(`Please input the correct song number`).then(x => x.delete({ timeout: 10000 }))
    if (args[0] > queue.songs.length) return message.reply(`The queue only have ${queue.songs.length} Songs!`).then(x => x.delete({ timeout: 10000 }))

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 1; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 1);
    }
    client.player.skip(message)
    message.channel.send(createEmbed("spotify", `**<a:yes:765207711423004676> | Operation to skip \`${args[0] - 1}\` songs Successful!**`)).then(x => x.delete({ timeout: 10000 }))
  }
};

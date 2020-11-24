const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  category: "Music",
  descriptions: "UNDER CONSTRUCTION",
  usage: "nowplaying",
  options: [""],
  cooldown: "",
  ownerOnly: true,
  guildOnly: true,
  run: async function(client, message, args) {
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;
    const nowpl = "[" + createBar((song.duration == 0 ? seek : song.duration), seek, 20)[0] + "]"
    const date = `${new Date(seek * 1000).toISOString().substr(11, 8)}/${(song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8))}`

    let nowPlaying = new MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setAuthor(`Youtube Client Now Playing`)
      .setThumbnail(song.thumbnail)
      .setDescription(`**『[${song.title}](${song.url})』\n\n${nowpl}\n\`${date}\`\nRequested by \`【${song.requester}】\`**`)
    
    if (song.duration > 0) nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
    
    return message.channel.send(nowPlaying);
  }
};

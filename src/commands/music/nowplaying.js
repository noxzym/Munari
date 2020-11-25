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
  ownerOnly: false,
  guildOnly: true,
  run: async function(client, message, args) {
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.nowplaying - seek;
    const nowpl = createBar((song.nowplaying == 0 ? seek : song.nowplaying), seek, 15)[0]

    const duration = song.nowplaying

    let dur;
    if ((duration === 3600 || duration > 3600)) {
      dur = new Date(((queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000).toFixed(0) * 1000).toISOString().substr(11, 8)
    } else {
      dur = new Date(((queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000).toFixed(0) * 1000).toISOString().substr(14, 5)
    }

    let remaining;
    if ((duration === 3600 || duration > 3600)) {
      remaining = new Date((song.nowplaying - (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000).toFixed(0) * 1000).toISOString().substr(11, 8)
    } else {
      remaining = new Date((song.nowplaying - (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000).toFixed(0) * 1000).toISOString().substr(14, 5)
    }

    const date = `${dur}/${(song.nowplaying == 0 ? " ◉ LIVE" : song.duration)}`

    let nowPlaying = new MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setAuthor(`Youtube Client Now Playing`)
      .setTitle(`${song.title}`)
    await nowPlaying.setURL(client.queue.get(message.guild.id).songs[0].url)
      .setDescription(`➤ **${nowpl} \`[${date}]\` \nRequested by \`【${song.requester}】\`**`)
      .setThumbnail(song.thumbnail)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
    return message.channel.send(nowPlaying);
  }
};

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
    const nowpl = createBar((song.nowplaying == 0 ? seek : song.nowplaying), seek, 15)[0]
    const status = queue.playing ? '▶️' : '⏸️'

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
      .setColor('#ff0000')
      .setAuthor(`Youtube Client Now Playing`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
      .setTitle(`${song.title}`)
    await nowPlaying.setURL(client.queue.get(message.guild.id).songs[0].url)
      .setDescription(`${status} **${nowpl} \`[${date}]\` \nRequested by \`【${song.requester}】\`**`)
      .setThumbnail(song.thumbnail)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))

    let listenmoenoeplaying = new MessageEmbed()
      .setColor('1d1f2b')
      .setAuthor(`Listen.moe Now Playing`, 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
      .setTitle(`${song.title}`)
    await nowPlaying.setURL(client.queue.get(message.guild.id).songs[0].url)
      .setDescription(`${status} **${nowpl} \`[${date}]\` \nRequested by \`【${song.requester}】\`**`)
      .setThumbnail(song.thumbnail)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))

    song.url.includes("youtube.com") ? message.channel.send(nowPlaying) : message.channel.send(listenmoenoeplaying)
    }
};

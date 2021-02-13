const createBar = require("string-progressbar");
const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  category: "Music",
  descriptions: "UNDER CONSTRUCTION",
  usage: "nowplaying",
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
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const nowpl = createBar((song.nowplaying === undefined ? seek : song.nowplaying), seek, 15)[0]
    const status = queue.playing ? '▶️' : '⏸️'

    const duration = song.nowplaying

    let dur;
    if ((duration >= 3600)) {
      dur = new Date(((queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000).toFixed(0) * 1000).toISOString().substr(11, 8)
    } else {
      dur = new Date(((queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000).toFixed(0) * 1000).toISOString().substr(14, 5)
    }

    const date = duration !== undefined ? `${dur}/${song.duration}` : " ◉ LIVE " 

    let nowPlaying = createEmbed()
      .setColor('#ff0000')
      .setAuthor(`Youtube Client Now Playing`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
      .setTitle(`${song.title}`)
      .setDescription(`${status} **${nowpl} \`[${date}]\` \nRequested by \`【${song.requester.username}】\`**`)
      .setThumbnail(song.thumbnail)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
    nowPlaying.setURL(song.url)

    let listenmoenoeplaying = createEmbed()
      .setColor('1d1f2b')
      .setAuthor(`Listen.moe Now Playing`, 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
      .setTitle(`${song.title}`)
      .setDescription(`${status} **${nowpl} \`[${date}]\` \nRequested by \`【${song.requester.username}】\`**`)
      .setThumbnail(song.thumbnail)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
    istenmoenoeplaying.setURL(song.url)

    song.url.includes("youtube.com") ? message.channel.send(nowPlaying) : message.channel.send(listenmoenoeplaying)
  }
};

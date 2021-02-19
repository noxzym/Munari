const { Util } = require("discord.js");
const { createEmbed } = require("../../utils/createEmbed");
const convert = require("pretty-ms");

module.exports = {
  name: "playlava",
  aliases: ["plava"],
  category: "Developer",
  descriptions: "Playing song from youtube client",
  usage: "play <[spotify/youtube][title/url/playlist]>",
  options: ["--find"],
  cooldown: "5",
  ownerOnly: true,
  guildOnly: true,
  missing: {
    botperms: ["CONNECT", "SPEAK", "EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const queue = message.guild.queue;
    const { channel } = message.member.voice;
    if (!channel) return
    const search = args.join(" ");
    if (!search) return;

    const track = await client.shoukaku.getSongs(search);
    const song = await track.tracks.shift()

    var queueConstruct = {
      textChannel: message.channel.id,
      voiceChannel: channel.id,
      guildId: message.guild.id,
      songs: [],
      connection: null,
      loop: false,
      volume: 100,
      playing: true,
      timeout: null
    };

    const data = {
      track: song.track,
      title: Util.escapeMarkdown(song.info.title),
      identifier: song.info.identifier,
      author: song.info.author,
      duration: convert(song.info.length, { colonNotation: true }),
      nowplaying: song.info.length,
      url: song.info.uri,
      thumbnail: `https://img.youtube.com/vi/${song.info.identifier}/sddefault.jpg?size=4096`,
      requester: message.author
    };

    if (queue) {
      queue.songs.push(data)
      return message.channel.send(createEmbed("info", `${song.info.title} Has been added to queue`))
    };

    if (!queue) {
      try {
        queueConstruct.songs.push(data);
        message.guild.queue = queueConstruct;
        const node = await client.shoukaku.manager.getNode();
        const player = await node.joinVoiceChannel({ deaf: true, guildID: message.guild.id, voiceChannelID: message.member.voice.channel.id });
        queueConstruct.connection = await player;
        await client.shoukaku.play(queueConstruct.songs[0], message)
      } catch (e) {
        console.log(e);
        message.guild.queue = null;
        message.guild.me.voice.channel.leave();
        message.channel.send(createEmbed("error", `Operation Canceled. Because: ${e.message}`))
      }
    }
  }
};
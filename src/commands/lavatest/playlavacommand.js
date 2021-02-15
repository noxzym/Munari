const { Util } = require("discord.js");
const { createEmbed } = require("../../utils/createEmbed");

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

    const spotifyregex = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
    var song;
    try {
      if (spotifyregex.test(args[0])) {
        song = await client.lavaplayer.getSongs(search, "spotify")
      } else {
        song = await client.lavaplayer.getSongs(search, "youtube")
      }
    } catch (e) {
      return message.channel.send(createEmbed("error", "Operation Canceled. Because: Empty Data"))
    }

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

    if (queue !== null) {
      queue.songs.push(song)
      return message.channel.send(createEmbed("info", `${song.info.title} Has been added to queue`))
    };

    if (queue === null) {
      try {
        queueConstruct.songs.push(song);
        message.guild.queue = queueConstruct;
        await client.lavaplayer.play(queueConstruct.songs[0].track, message)
      } catch (e) {
        console.log(e);
        message.guild.queue = null;
        message.guild.me.voice.channel.leave();
        message.channel.send(createEmbed("error", `Operation Canceled. Because: ${e.message}`))
      }
    }
  }
};
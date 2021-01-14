const { Util } = require("discord.js");
const { play, playlist, createEmbed } = require('../../utils/Function')

const ytdl = require("ytdl-core");
const yts = require('yt-search')
const ytsr = require('youtube-sr');

// const YouTubeAPI = require("simple-youtube-api");

// let ytapk;
// try {
//   ytapk = "AIzaSyAeoZxsotVd1HdcqG8KXAIzS_O8FxQbel0";
// } catch {  
//   ytapk = "AIzaSyA5zRuMYIbt4Y_NlF317OG4ia84P1M9qWY";
// }

// const youtube = new YouTubeAPI(ytapk);

module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Music",
  descriptions: "Playing song from youtube client",
  usage: "play <song[title/url/id]>",
  options: ["--find"],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  run: async function (client, message, args) {
    const { channel } = message.member.voice;
    if (!channel) return message.inlineReply("Please join voice channel first!").catch(console.error).then(msg => { msg.delete({ timeout: 8000 }); });

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send(
        "I cannot connect to your voice channel"
      ).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (!permissions.has("SPEAK"))
      return message.channel.send(
        "I cannot speak in this voice channel"
      ).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) {
      return message.inlineReply(`I has join channel **\`🔊${message.guild.me.voice.channel.name}\`**`).then(msg => { msg.delete({ timeout: 8000 }); });
    }

    const search = args.join(" ");
    const videoPattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$gi/;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlv = videoPattern.test(args[0]);

    if (!search) {
      return message.channel.send(client.config.prefix + this.usage);
    }

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return playlist(url, channel, message, client);
    }

    let songInfo;
    let song;

    try {
      if (urlv) {
        try {
          songInfo = await ytdl.getInfo(url);
          const infoSong = await yts(songInfo.videoDetails.title)
          song = {
            title: Util.escapeMarkdown(infoSong.all[0].title),
            identifier: infoSong.all[0].videoId,
            author: infoSong.all[0].author.name,
            duration: infoSong.all[0].timestamp,
            nowplaying: infoSong.all[0].seconds,
            url: infoSong.all[0].url,
            thumbnail: infoSong.all[0].thumbnail + "?size=4096",
            requester: message.author
          };
        } catch (e) {
          console.log(e);
          return message.channel.send(createEmbed("error", "I could not find any videos that match that link")).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        }
      } else if (message.content.includes('--find')) {
        try {
          var searcher = await ytsr.search(search, { limit: 5 });
          if (searcher[0] === undefined) return message.channel.send(createEmbed("error", `I can't to find related video`)).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
          let index = 0;
          let em = createEmbed('yt')
            .setAuthor(`Youtube Client get Video`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
            .setTitle(`This is result for ${search}`)
            .setDescription(`${searcher.map(x => `**${++index} • [${x.title}](${x.url}) \`[${x.durationFormatted}]\`**`).join('\n')}`)
            .setFooter(`Type 'cancel' to cancel the song request`)
          var embedsearch = await message.channel.send(em)
          try {
            var response = await message.channel.awaitMessages(
              message2 => /^(?:[1-4]|5|cancel|c)$/g.test(message2.content.toLowerCase()) && message2.author.id === message.author.id, {
              max: 1,
              time: 30000,
              errors: ["time"]
            }
            );
            const input = response.first().content.substr(0, 6).toLowerCase()
            if (input === 'cancel' || input === 'c') {
              embedsearch.suppressEmbeds(true).then(x => { x.edit(`<a:no:765207855506522173> | Request canceled`) })
              return embedsearch.delete({ timeout: 3000 })
            }
            embedsearch.delete()
            const videoIndex = parseInt(response.first().content);
            var video = await searcher[videoIndex - 1];

          } catch (e) {
            return message.channel.send(createEmbed("error", "The request has been canceled because no respond!")).then(x => x.delete({ timeout: 3000 }) && embedsearch.delete())
          }

          const infoSong = await yts(video.title);
          const vid = infoSong.all[0];
          song = {
            title: Util.escapeMarkdown(vid.title),
            identifier: vid.videoId,
            author: vid.author.name,
            duration: vid.timestamp,
            nowplaying: vid.seconds,
            url: vid.url,
            thumbnail: vid.thumbnail + "?size=4096",
            requester: message.author
          };
        } catch (e) {
          console.log(e);
          return message.channel.send(createEmbed("error", "I could not find any videos that match that title")).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        }
      } else {
        try {
          const infoSong = await yts(search);
          const vid = infoSong.all[0];
          song = {
            title: Util.escapeMarkdown(vid.title),
            identifier: vid.videoId,
            author: vid.author.name,
            duration: vid.timestamp,
            nowplaying: vid.seconds,
            url: vid.url,
            thumbnail: vid.thumbnail + "?size=4096",
            requester: message.author
          };
        } catch (e) {
          console.error();
          message.channel.send(createEmbed("error", "I could not find any videos that match that title")).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        }
      }

      const serverQueue = message.client.queue.get(message.guild.id);

      if (serverQueue) {

        const filterbefore = serverQueue.songs;
        const identifierfilter = filterbefore.slice(1).filter(x => song.identifier.includes(x.identifier))
        
        if (Boolean(identifierfilter.map(x => x.identifier === song.identifier).join())) {

          return message.channel.send(createEmbed("error", `Sorry, this song is already in the queue.`)).then(msg => { msg.delete({ timeout: 8000 }); });

        }

        serverQueue.songs.push(song);
        return message.channel.send(createEmbed("info", `✅ **\`${song.title}\`** by **\`${song.requester.username}\`** Has been added to queue!`))

      }

      const queueConstruct = {
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

      message.client.queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);

      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message, client);
      } catch (error) {

        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(createEmbed("error", `I could not join the voice channel:\n${error}`)).then(msg => { msg.delete({ timeout: 8000 }); });

      }
    } catch (err) {
      console.log(err);
      message.channel.send(createEmbed("error", `Cannot play this song because ${err}`)).then(msg => { msg.delete({ timeout: 8000 }); });
    }
  }
};

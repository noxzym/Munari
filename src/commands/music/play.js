const { Discord, Util, MessageEmbed } = require("discord.js");
const ytdlp = require("ytdl-core-discord");
const ytdl = require("ytdl-core");
const yts = require('yt-search')
const ytsr = require('youtube-sr')
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
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  run: async function (client, message, args) {
    try {
      const { channel } = message.member.voice;
      if (!channel)
        return message
          .reply("Please join voice channel first!")
          .catch(console.error)
          .then(msg => {
            msg.delete({ timeout: 20000 });
          });
      const permissions = channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))
        return message.channel.send(
          "I cannot connect to your voice channel, make sure I have the proper permissions!"
        );
      if (!permissions.has("SPEAK"))
        return message.channel.send(
          "I cannot speak in this voice channel, make sure I have the proper permissions!"
        );

      const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

      if (playlistPattern.test(args[0])) {
        return message.channel.send("I can`t play video from playlist");
      }

      const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;

      const prefix = "m!";

      const urlv = videoPattern.test(args[0]);
      const url = args[0];
      const search = args.join(" ");
      if (!search) {
        return message.channel.send(prefix + this.usage);
      }
      let songInfo;
      let song;

      if (urlv) {
        try {
          songInfo = await ytdl.getInfo(url);
          const infoSong = await yts(songInfo.videoDetails.title)
          song = {
            title: Util.escapeMarkdown(songInfo.videoDetails.title),
            url: songInfo.videoDetails.video_url,
            duration: infoSong.all[0].timestamp,
            thumbnail: infoSong.all[0].thumbnail + "?size=4096",
            nowplaying: songInfo.videoDetails.lengthSeconds,
            requester: `${message.author.tag}`,
            channel: songInfo.videoDetails.author.name
          };
        } catch (e) {
          console.log(e);
          return message.channel.send("I could not find any videos that match that link");
        }
      } else {
        try {
          var searcher = await ytsr.search(search, { limit: 5 });
          if (searcher[0] === undefined) return message.channel.send(`I can't to find related video`)
          let index = 0;
          let em = new MessageEmbed()
            .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
            .setAuthor(`Youtube Client get Video`)
            .setTitle(`This is result for ${search}`)
            .setDescription(`${searcher.map(x => `**${++index} • [${x.title}](${x.url}) \`[${x.durationFormatted}]\`**`).join('\n')}`)
          var embedsearch = await message.channel.send(em)
          try {
            var response = await message.channel.awaitMessages(
              message2 => message2.content > 0 && message2.content < 6 && message2.author.id === message.author.id, {
              max: 1,
              time: 30000,
              errors: ["time"]
            }
            );
          } catch (e) {
            return message.channel.send({
              embed: {
                color: "RED",
                description: 'The request has canceled because no response'
              }
            }).then(x => x.delete({ timeout: 3000 }) && embedsearch.delete())
          }
          embedsearch.delete()
          response.delete()
          const videoIndex = parseInt(response.first().content);
          var video = await searcher[videoIndex - 1];

          var vids = `https://www.youtube.com/watch?v=${video.id}`;
          songInfo = await ytdl.getInfo(vids);
          const infoSong = await yts(songInfo.videoDetails.title);
          const vid = infoSong.all[0];
          song = {
            title: Util.escapeMarkdown(vid.title),
            url: vid.url,
            duration: vid.timestamp,
            nowplaying: songInfo.videoDetails.lengthSeconds,
            thumbnail: vid.thumbnail + "?size=4096",
            requester: `${message.author.tag}`,
            channel: vid.author.name
          };
        } catch (e) {
          console.log(e);
          return message.channel.send("I could not find any videos that match that title");
        }
      }

      const serverQueue = message.client.queue.get(message.guild.id);

      if (serverQueue) {
        serverQueue.songs.push(song);
        return message.channel.send(`✅ **\`${song.title}\`** by **\`${song.requester}\` Has been added to queue!**`);
      }

      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        loop: false,
        songs: [],
        volume: 100,
        playing: true
      };

      message.client.queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);

      const play = async song => {
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
          setTimeout(function () {
            if (
              !queue.connection.dispatcher &&
              message.guild.me.voice.channel
            ) {
              message.guild.me.voice.channel.leave();
              queue.textChannel
                .send("I have disconnected")
                .then(msg => {
                  msg.delete({ timeout: 5000 });
                })
                .catch(console.error);
            } else return;
          }, 120000);
          message.client.queue.delete(message.guild.id);
          return queue.textChannel
            .send(
              "Music queue ended, I'll disconnect in 2 minutes if no songs are playing"
            )
            .then(msg => {
              msg.delete({ timeout: 5000 });
            })
            .catch(console.error);
        }

        queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
        const dispatcher = queue.connection
          .play(
            await ytdlp(song.url, { filter: 'audioonly' }), { type: "opus" }
          )
          .on("finish", () => {

            if (queue.loop) {
              let lastSong = queue.songs.shift();
              queue.songs.push(lastSong);
              play(queue.songs[0]);
            } else {
              queue.songs.shift();
              play(queue.songs[0]);
            }
          })
          .on("error", error => console.error(error));

        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        try {
          let duras;
          if (song.duration === undefined) {
            duras = "◉ LIVE"
          } else {
            duras = song.duration
          }
          let embed = new MessageEmbed()
            .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
            .setAuthor(`Youtube Client`)
            .setThumbnail(song.thumbnail)
            .setDescription(`**[${song.title}](${song.url})\nDuration: \`${duras}\`     Channel: \`${song.channel}\`**`)
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
          queue.textChannel.send(embed)
        } catch (error) {
          console.error(error);
          message.channel.send(error.message);
        }
      };

      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`I could not join the voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel
          .send(`I could not join the voice channel: ${error}`)
          .then(msg => {
            msg.delete({ timeout: 5000 });
          });
      }
    } catch (err) {
      console.log(err);
      message.channel.send(`Cannot play this song because ${err}`).then(msg => {
        msg.delete({ timeout: 2000 });
      });
    }
  }
};

const { Discord, Util, MessageEmbed } = require("discord.js-light");
const ytdlp = require("discord-ytdl-core");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

let ytapk;
try {
  ytapk = "AIzaSyAeoZxsotVd1HdcqG8KXAIzS_O8FxQbel0";
} catch {  
  ytapk = "AIzaSyA5zRuMYIbt4Y_NlF317OG4ia84P1M9qWY";
}

const ffmpegFilters = {
  "3d": "apulsator=hz=0.125",
  bassboost: "dynaudnorm=f=150:g=15,equalizer=f=40:width_type=h:width=50:g=10",
  echo: "aecho=0.8:0.9:1000:0.3",
  flanger: "flanger",
  gate: "agate",
  haas: "haas",
  karaoke: "stereotools=mlev=0.1",
  nightcore:
    "asetrate=48000*1.25,aresample=48000,equalizer=f=40:width_type=h:width=50:g=10",
  reverse: "areverse",
  vaporwave: "asetrate=48000*0.8,aresample=48000,atempo=1.1",
  none: "none"
};

const youtube = new YouTubeAPI(ytapk);
module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Music",
  descriptions: "Playing song from youtube client",
  usage: "play <title / url>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function(client, message, args) {
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

      const prefix = "m!";
      const search = args.join(" ");
      if (!search) {
        return message.channel.send(prefix + this.usage);
      }

      const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
      const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

      if (playlistPattern.test(args[0])) {
        return message.channel.send("I can`t play video from playlist");
      }

      const serverQueue = message.client.queue.get(message.guild.id);
      const results = await youtube.searchVideos(search, 1);
      const songInfo = await ytdl.getInfo(results[0].url);

      const song = {
        title: Util.escapeMarkdown(songInfo.videoDetails.title) || null,
        url: songInfo.videoDetails.video_url || null,
        duration: songInfo.videoDetails.lengthSeconds,
        thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
        requester: `${message.author.tag}`,
        channel: songInfo.videoDetails.author.name
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
        return message.channel.send(
          `✅ **\`${song.title}\`** by **\`${song.requester}\` Has been added to queue!**`
        );
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
          setTimeout(function() {
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

        queue.connection.on("disconnect", () =>
          message.client.queue.delete(message.guild.id)
        );

        const dispatcher = queue.connection
          .play(
            await ytdlp(song.url, {
              filter: "audioonly",
              opusEncoded: true,
              encoderArgs: ["-af", ffmpegFilters.none]
              // seek: 60,
            }),
            { type: "opus" }
          )
          .on("finish", () => {
            if (collector && !collector.ended) collector.stop();

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
          let duration = new Date(song.duration * 1000)
            .toISOString()
            .substr(11, 8);
          let embed = new MessageEmbed()
            .setColor(
              message.member.roles.cache
                .sort((a, b) => b.position - a.position)
                .first().color
            )
            .setAuthor(`Youtube Client`)
            .setThumbnail(song.thumbnail)
            .setDescription(
              `**[${song.title}](${song.url})\nDuration: \`${duration}\`     Channel: \`${song.channel}\`**`
            )
            .setFooter(
              `Commanded by ${message.author.tag}`,
              message.author.avatarURL({ dynamic: true })
            )
            .setTimestamp();
          var react = await queue.textChannel.send(embed);
          await react.react("⏯️");
          await react.react("⏹️");
          await react.react("⏭️");
          await react.react("🔁");
          await react.react("🔀");
          await react.react("🔇");
          await react.react("🔉");
          await react.react("🔊");
          const filter = (reaction, user) => user.id !== message.client.user.id;
          var collector = react.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
          });

          collector.on("collect", (reaction, user) => {
            if (!queue) return;
            const member = message.guild.member(user);

            const { channel } = member.voice;
            const botChannel = member.guild.me.voice.channel;

            if (channel !== botChannel) {
              return message.channel
                .send(`${member}, You need to join the voice channel first!`)
                .then(msg => {
                  msg.delete({ timeout: 5000 });
                })
                .catch(console.error);
            }

            switch (reaction.emoji.name) {
              case "⏯️":
                reaction.users.remove(user).catch(console.error);
                if (queue.playing) {
                  queue.playing = !queue.playing;
                  queue.connection.dispatcher.pause(true);
                  queue.textChannel
                    .send(
                      `<a:yes:765207711423004676> | ${user} has paused the music!`
                    )
                    .then(msg => {
                      msg.delete({ timeout: 5000 });
                    })
                    .catch(console.error);
                } else {
                  queue.playing = !queue.playing;
                  queue.connection.dispatcher.resume();
                  queue.textChannel
                    .send(
                      `<a:yes:765207711423004676> | ${user} has resumed the music!`
                    )
                    .then(msg => {
                      msg.delete({ timeout: 5000 });
                    })
                    .catch(console.error);
                }
                break;

              case "⏹️":
                reaction.users.remove(user).catch(console.error);
                queue.songs = [];
                queue.textChannel
                  .send(
                    `<a:yes:765207711423004676> | ${user} has stopped the music!`
                  )
                  .then(msg => {
                    msg.delete({ timeout: 5000 });
                  })
                  .catch(console.error);
                try {
                  queue.connection.dispatcher.end();
                } catch (error) {
                  console.error(error);
                  queue.connection.disconnect();
                }
                collector.stop();
                break;

              case "⏭️":
                queue.playing = true;
                reaction.users.remove(user).catch(console.error);
                queue.connection.dispatcher.end();
                queue.textChannel
                  .send(
                    `<a:yes:765207711423004676> | ${user} has skipped the song!`
                  )
                  .then(msg => {
                    msg.delete({ timeout: 5000 });
                  })
                  .catch(console.error);
                collector.stop();
                break;

              case "🔁":
                reaction.users.remove(user).catch(console.error);
                queue.loop = !queue.loop;
                queue.textChannel
                  .send(
                    `<a:yes:765207711423004676> | Loop is now ${
                      queue.loop ? `**\`On\`**` : `**\`Off\`**`
                    }`
                  )
                  .then(msg => {
                    msg.delete({ timeout: 5000 });
                  })
                  .catch(console.error);
                break;

              case "🔀":
                reaction.users.remove(user).catch(console.error);
                let songs = queue.songs;
                for (let i = songs.length - 1; i > 1; i--) {
                  let j = 1 + Math.floor(Math.random() * i);
                  [songs[i], songs[j]] = [songs[j], songs[i]];
                }
                queue.songs = songs;
                message.client.queue.set(message.guild.id, queue);
                queue.textChannel
                  .send(
                    `<a:yes:765207711423004676> | ${user} has shuffled the queue!`
                  )
                  .then(msg => {
                    msg.delete({ timeout: 5000 });
                  })
                  .catch(console.error);
                break;

              case "🔇":
                reaction.users.remove(user).catch(console.error);
                if (queue.volume <= 0) {
                  queue.volume = 100;
                  queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
                  queue.textChannel
                    .send(
                      `<a:yes:765207711423004676> | ${user} has unmuted the music!`
                    )
                    .then(msg => {
                      msg.delete({ timeout: 5000 });
                    })
                    .catch(console.error);
                } else {
                  queue.volume = 0;
                  queue.connection.dispatcher.setVolumeLogarithmic(0);
                  queue.textChannel
                    .send(
                      `<a:yes:765207711423004676> | ${user} has muted the music!`
                    )
                    .then(msg => {
                      msg.delete({ timeout: 5000 });
                    })
                    .catch(console.error);
                }
                break;

              case "🔉":
                reaction.users.remove(user).catch(console.error);
                if (queue.volume - 10 <= 0) queue.volume = 0;
                else queue.volume = queue.volume - 10;
                queue.connection.dispatcher.setVolumeLogarithmic(
                  queue.volume / 100
                );
                queue.textChannel
                  .send(
                    `<a:yes:765207711423004676> | ${user} has decreased the volume to ${queue.volume}%`
                  )
                  .then(msg => {
                    msg.delete({ timeout: 5000 });
                  })
                  .catch(console.error);
                break;

              case "🔊":
                reaction.users.remove(user).catch(console.error);
                if (queue.volume + 10 >= 100) queue.volume = 100;
                else queue.volume = queue.volume + 10;
                queue.connection.dispatcher.setVolumeLogarithmic(
                  queue.volume / 100
                );
                queue.textChannel
                  .send(
                    `<a:yes:765207711423004676> | ${user} has increased the volume to ${queue.volume}%`
                  )
                  .then(msg => {
                    msg.delete({ timeout: 5000 });
                  })
                  .catch(console.error);
                break;

              default:
                reaction.users.remove(user).catch(console.error);
                break;
            }
          });

          collector.on("end", () => {
            react.reactions.removeAll().catch(console.error);
          });
        } catch (error) {
          console.error(error);
          message.channel.send(error.message);
        }
      };

      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0]);
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

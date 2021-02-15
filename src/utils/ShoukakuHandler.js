const MuriNode = { name: "MuriNode", host: "MuriNode.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' };
const MuriNode2 = { name: "MuriNode2", host: "MuriNode2.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' };
const MuriNode3 = { name: "MuriNode3", host: "MuriNode3.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' }
const { LavasfyClient } = require("lavasfy");

const { Util } = require("discord.js")
const { getTracks, getPreview } = require('spotify-url-info')
const yts = require('yt-search');

module.exports = class ShoukakuPLayer {
  constructor(client) {
    this.client = client;
  };
  async getSongs(title, option) {
    const videoPattern = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/
    const playlistPattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?.*(youtu.be\/|list=)([^#\&\?]*).*/;
    const spotifyregex = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;

    if (option === "spotify") {
      const input = title.match(spotifyregex);
      if (input[1] === "track") {
        const songdata = [];
        const getdata = await getPreview(title);
        const infoSong = await yts.search(`${getdata.title} - ${getdata.artist}`);
        let filter = [
          "video",
          "live"
        ];

        const getzero = infoSong.all.filter(x => filter.includes(x.type))[0];
        songdata.push({
          title: Util.escapeMarkdown(getzero.title),
          url: getzero.url,
        });

        const node = await this.client.shoukaku.getNode()
        const data = await node.rest.resolve(await songdata[0].title, "youtube");
        if (!data) throw Error("Empty Data");
        const track = data.tracks.shift()
        return track
      } else return;
    } else {
      const node = await this.client.shoukaku.getNode()
      const data = await node.rest.resolve(title, option);
      if (!data) throw Error("Empty Data");
      const track = data.tracks.shift()
      return track
    }
  };

  async play(track, message) {
    const queue = message.guild.queue;
    const node = await this.client.shoukaku.getNode();
    const player = await node.joinVoiceChannel({
      deaf: true,
      guildID: message.guild.id,
      voiceChannelID: message.member.voice.channel.id
    });
    queue.connection = await player;
    await queue.connection.playTrack(track)
    queue.connection.on("start", () => {
      message.channel.send(`NowPlaying: ${queue.songs[0].info.title}`)
    });
    queue.connection.on("end", async() => {
      await queue.songs.shift();
      if (queue.songs.length === 0) {
        await queue.connection.disconnect();
        return message.guild.queue = null
      } else {
        return queue.connection.playTrack(queue.songs[0], message);
      };
    });
    for (const event of ['closed', 'nodeDisconnect']) queue.connection.on(event, async() => {
      await queue.connection.disconnect();
      return message.guild.queue = null
    });
  }
}
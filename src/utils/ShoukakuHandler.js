const { LavasfyClient } = require("lavasfy");
const { getPreview } = require('spotify-url-info');
const { createEmbed } = require("./createEmbed");

module.exports = class ShoukakuPLayer {
  constructor(client) {
    this.client = client;
  };
  async getSongs(query, option) {
    const spotifyregex = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
    var lavasfy = new LavasfyClient({ clientID: this.client.config.spcid, clientSecret: this.client.config.spcs }, this.client.config.nodes);
    var node = await this.client.shoukaku.getNode()
    if (spotifyregex.test(query)) {
      await lavasfy.requestToken();
      const node = lavasfy.nodes.get(this.client.shoukaku.getNode().name);
      const load = await node.load(query);
      return load;
    } else if (option === "spotify") {
      if (spotifyregex.test(query)) {
        await lavasfy.requestToken();
        const node = lavasfy.nodes.get(this.client.shoukaku.getNode().name);
        const load = await node.load(query);
        return load;
      } else {
        const data = await getPreview(query);
        await lavasfy.requestToken();
        const node = lavasfy.nodes.get(this.client.shoukaku.getNode().name);
        const load = await node.load(data.link);
        return load;
      };
    } else if (option === undefined) {
      const load = await node.rest.resolve(query, "youtube");
      return load;
    } else {
      const load = await node.rest.resolve(query, option);
      return load;
    }
  };
  async play(track, message) {
    const queue = message.guild.queue;
    const node = await this.client.shoukaku.getNode();
    const player = await node.joinVoiceChannel({ deaf: true, guildID: message.guild.id, voiceChannelID: message.member.voice.channel.id });
    queue.connection = await player;

    try {
      await queue.connection.playTrack(track);

      queue.connection.on("start", async() => {
        let e = createEmbed("info")
          .setAuthor(`${this.client.user.username} • Playing`, this.client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
          .setDescription(`**[\`${queue.songs[0].title}\`]\nDuration: \`${queue.songs[0].duration}\`**`)
          .setThumbnail(queue.songs[0].thumbnail)
          .setTimestamp()
          .setFooter(`Requested by ${queue.songs[0].requester.username}`)
        this.client.channels.cache.get(queue.textChannel).send(e)
      });

      queue.connection.on("end", async() => {
        await queue.songs.shift();
        if (queue.songs.length === 0) {
          await queue.connection.disconnect();
          return message.guild.queue = null;
        } else {
          return queue.connection.playTrack(queue.songs[0].track, message)
        }
      })

      for (const event of ['closed', 'nodeDisconnect']) queue.connection.on(event, async() => {
        await queue.connection.disconnect();
        return message.guild.queue = null
      });

    } catch (e) {
      queue.connection.disconnect();
      return message.guild.queue = null;
    }
  };
}
const { version } = require("discord.js");
const { createEmbed, pagination } = require("../../utils/Function");
const os = require('os');
const cpuStat = require("cpu-stat");
const formatMs = require("pretty-ms");

module.exports = {
  name: "stats",
  aliases: null,
  category: "Utility",
  descriptions: "Display statistic bot",
  usage: "stats",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    await cpuStat.usagePercent(async (err, percent, seconds) => {
      if (err) throw err;

      let array = []
      let systemembed = createEmbed("info")
        .setAuthor("Munari Statistics", client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        .setDescription(
          `\`\`\`asciidoc\n` +
          `• D.js Version       :: v${version}\n` +
          `• Node.js Version    :: ${process.version}\n` +
          `• Bot Version        :: v${require("../../../package.json").version}\n\n` +
          `• Platform           :: ${os.platform()} ${os.arch()} Bit\n` +
          `• CPU Usage          :: ${percent.toFixed(2)}%\n` +
          `• Total Memory       :: ${(await client.totalMemory("heapTotal") / 1024 / 1024).toFixed(2)} MB\n` +
          `• Memory Usage       :: ${(await client.totalMemory("heapUsed") / 1024 / 1024).toFixed(2)} MB\n` +
          `• OS Uptime          :: ${formatMs(os.uptime(), { secondsDecimalDigits: 0, compact: false })}\n` +
          `• Process Uptime     :: ${formatMs(process.uptime() * 1000, { secondsDecimalDigits: 0, compact: false })}\n\n` +
          `• Users count        :: ${await client.totalUsers()}\n` +
          `• Channels count     :: ${await client.totalChannels()}\n` +
          `• Guilds Count       :: ${await client.totalGuilds()}\n` +
          `• Shards Count       :: ${client.shard.count}\n` +
          `• Shards ID          :: ${client.shard.ids[0]}\n` +
          `• Playing On         :: ${await client.totalPlaying()} Guild(s)` +
          `\n\`\`\``
        )
        .setTimestamp()
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }));

      let botembed = createEmbed("info")
        .setAuthor("Munari Statistics", client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        .setDescription(
          `\`\`\`asciidoc\n` +
          `• Users count    :: ${await client.totalUsers()}\n`+
          `• Channels count :: ${await client.totalChannels()}\n`+
          `• Guilds Count   :: ${await client.totalGuilds()}\n`+
          `• Shards Count   :: ${client.shard.count}\n`+
          `• Shards ID      :: ${client.shard.ids[0]}\n`+
          `• Playing On     :: ${await client.totalPlaying()} Guild(s)`+
          `\n\`\`\``
        )
        .setTimestamp()
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }));

      let botversion = createEmbed("info")
        .setAuthor("Munari Statistics", client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        .setDescription(
          `\`\`\`asciidoc\n` +
          `• Discord.js Version :: v${version}\n`+
          `• Node.js Version    :: ${process.version}\n`+
          `• Bot Version        :: v${require("../../../package.json").version}\n`+
          `\n\`\`\``
        )
        .setTimestamp()
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }));

        return message.channel.send(systemembed)
    })
  }
}
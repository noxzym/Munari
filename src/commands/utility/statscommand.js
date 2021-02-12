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
    await cpuStat.usagePercent(async (err, percent) => {
      if (err) throw err;

      let systemembed = createEmbed("info")
        .setAuthor("Munari Rose Statistics", client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        .addField(
          "__STATISTICS__",
          `\`\`\`asciidoc\n` +
          `• Guilds Count   :: ${await client.totalGuilds()}\n` +
          `• Users count    :: ${await client.totalUsers()}\n` +
          `• Channels count :: ${await client.totalChannels()}\n` +
          `• Shards Count   :: ${client.shard.count}\n` +
          `• Shards ID      :: ${client.shard.ids[0]}\n` +
          `• Playing On     :: ${await client.totalPlaying()} Guild(s)` +
          `\`\`\``
        )
        .addField(
          "__SYSTEMS__",
          `\`\`\`asciidoc\n` +
          `• Discord.js     :: v${version}\n` +
          `• Node.js        :: ${process.version}\n` +
          `• Bot Version    :: v${require("../../../package.json").version}\n` +
          `• Platform       :: ${os.platform()} ${os.arch()} Bit\n` +
          `• CPU Usage      :: ${percent.toFixed(2)}%\n` +
          `• Memory Usage   :: ${(await client.totalMemory("heapUsed") / 1024 / 1024).toFixed(2)} MB\n` +
          `• OS Uptime      :: ${formatMs(os.uptime(), { secondsDecimalDigits: 0, compact: false })}\n` +
          `• Process Uptime :: ${formatMs(process.uptime() * 1000, { secondsDecimalDigits: 0, compact: false })}\n` +
          `• Processor      :: ${os.cpus().map(i => `${i.model}`)[0]}\n` +          
          `\`\`\``
        )
        .setTimestamp()
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }));

      message.channel.send(systemembed)
    })
  }
}
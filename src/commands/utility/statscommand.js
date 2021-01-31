const Discord = require("discord.js"), { version } = require('discord.js')
const os = require('os')
const cpuStat = require("cpu-stat");
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
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {

    const bot = client

    cpuStat.usagePercent(function (err, percent, seconds) {
      if (err) {
        return console.log(err);
      }

      let days = Math.floor((bot.uptime / 86400000) % 365);
      let hours = Math.floor((bot.uptime / 3600000) % 24);
      let mins = Math.floor((bot.uptime / 60000) % 60);
      let secs = Math.floor((bot.uptime / 1000) % 60);
      const playing = bot.queue.map(x => x).length

      let embedStats = new Discord.MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setThumbnail(bot.user.avatarURL({ dynamic: true }))
        .setDescription(`***• __SYSTEMS__***\n**\`\`\`asciidoc\n• Platform     :: ${os.platform()} ${os.arch()} Bit\n• CPU Usage    :: ${percent.toFixed(2)}%\n• Memory Usage :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n• Uptime       :: ${days}D ${hours}H ${mins}M ${secs}S\n• Discord.Js   :: v${version}\n• Node.Js      :: ${process.version}\n• WebSocket    :: ${bot.ws.ping} ms\n• Processor    :: ${os.cpus().map(i => `${i.model}`)[0]}\n\`\`\`**\n***• __PROGRAMS__***\n**\`\`\`asciidoc\n• Guilds         :: ${bot.guilds.cache.size} Servers\n• Users          :: ${bot.users.cache.size} Users\n• Channels       :: ${bot.channels.cache.size} Channels\n• Category       :: ${bot.channels.cache.filter(c => c.type === 'category').size} Category\n• Text Channels  :: ${bot.channels.cache.filter(c => c.type === 'text').size} Text Channel\n• Voice Channels :: ${bot.channels.cache.filter(c => c.type === 'voice').size} Voice Channel\n• Playing On     :: ${playing} Guilds\n\`\`\`**`)
        .setTimestamp()
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
      message.channel.send(embedStats)
    })
  }
}
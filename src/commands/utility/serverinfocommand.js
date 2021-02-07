const Discord = require("discord.js");
const moment = require('moment');
moment.locale();
module.exports = {
  name: "serverinfo",
  aliases: ["si"],
  category: "Utility",
  descriptions: "Display server informations",
  usage: "serverinfo",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const color = message.member.displayHexColor

    const sname = message.guild.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
    const sreg = message.guild.region.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
    const sver = message.guild.verificationLevel.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
    const sbos = message.guild.premiumSubscriptionCount
    const scr = moment(message.guild.createdAt).format('ll')

    const datecr = moment(message.guild.createdAt).format('ll')
    const channel = message.guild.channels.cache.size
    const channelc = message.guild.channels.cache.filter(c => c.type === 'category').size
    const channelt = message.guild.channels.cache.filter(c => c.type === "text").size
    const channelv = message.guild.channels.cache.filter(c => c.type === "voice").size

    const membert = message.guild.members.cache.size
    const online = message.guild.members.cache.filter(x => x.presence.status === 'online').size
    const offline = message.guild.members.cache.filter(x => x.presence.status !== 'online').size
    const idle = message.guild.members.cache.filter(x => x.presence.status === 'idle').size
    const dnd = message.guild.members.cache.filter(x => x.presence.status === 'dnd').size

    const owner = message.guild.owner.user.tag
    const ownerid = message.guild.owner.user.id
    const ownercr = moment(message.guild.owner.user.createdAt).format('ll')
    const ownerjo = moment(message.guild.owner.joinedAt).format('ll')

    const e = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle('Server Informations')
      .setDescription(`**__Overview__**\n**\`\`\`asciidoc\n• ServerName   :: ${sname}\n• ServerID     :: ${message.guild.id}\n• ServerRegion :: ${sreg}\n• Verif. Lvl.  :: ${sver}\n• Created At   :: ${scr}\n• Booster      :: ${sbos}\n\`\`\`**\n**__Details__**\n**\`\`\`asciidoc\n• Roles    :: ${message.guild.roles.cache.size}\n• Channels :: [${channel}]\n           :: ${channelc} Category\n           :: ${channelt} Text\n           :: ${channelv} Voice\n• Members  :: [${membert}]\n           :: ${online} Online\n           :: ${idle} Idle\n           :: ${dnd} Do Not Disturb\n           :: ${offline} Offline\n\`\`\`**\n**__Owner Informations__**\n**\`\`\`asciidoc\n• UserName  :: ${owner}\n• UserID    :: ${ownerid}\n• CreatedAt :: ${ownercr}\n• JoinedAt  :: ${ownerjo}\n\`\`\`**`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
    message.channel.send(e)
  }
}
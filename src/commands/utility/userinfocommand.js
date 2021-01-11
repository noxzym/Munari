const Discord = require('discord.js');
const moment = require('moment');
moment.locale();
module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  category: "Utility",
  descriptions: "Display user informations",
  usage: "userinfo [user]",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
    const member =
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
      message.mentions.members.first() ||
      message.member;
    const roles = member.roles.cache.sort((a, b) => b.position - a.position)
    const color = message.member.displayHexColor
    const date = moment(member.user.createdAt).format('ll');
    const Jdate = moment(member.joinedAt).format('ll');

    if (member.user.bot === true) {
      bot = "Beep Boop. Boop Beep?"
    } else {
      bot = "What's up?"
    }

    const e = new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setDescription(`**__User Informations__**\n**\`\`\`asciidoc\n• UserName     :: ${member.user.tag}\n• UserID       :: ${member.user.id}\n• Created At   :: ${date}\n• Joined At    :: ${Jdate}\n• Highest Role :: ${roles.first().name}\n• Lowest Role  :: ${roles.last(2)[0].name}\n• Type         :: ${bot}\n\`\`\`**`)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp()
    message.channel.send(e)
  }
}
const { createEmbed } = require("../../utils/Function");
module.exports = {
  name: "avatar",
  aliases: ["av"],
  category: "General",
  descriptions: "Display avatar of use",
  usage: "avatar [user]",
  options: ["--server"],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    if (args.slice(0).join("").match(/^(?:--server)$/g)) {
      let e = createEmbed("info")
        .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true, size: 4096, format: "png" }), message.guild.iconURL({ dynamic: true, size: 4096, format: "png" }))
        .setImage(message.guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        .setTimestamp();
      return message.channel.send(e)
    }

    let member =
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
      message.mentions.members.first() ||
      message.member;
    
    let e = createEmbed("info")
      .setAuthor(`${member.user.tag}`, member.user.avatarURL({ format: "png", dynamic: true, size: 4096 }), member.user.avatarURL({ format: "png", dynamic: true, size: 4096 }))
      .setImage(member.user.avatarURL({ format: "png", dynamic: true, size: 4096 }))
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp();
    message.channel.send(e)
  }
};

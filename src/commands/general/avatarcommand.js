const { createEmbed } = require("../../utils/Function");
module.exports = {
  name: "avatar",
  aliases: ["av"],
  category: "General",
  descriptions: "Display avatar of use",
  usage: "avatar [user]",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    if (args.slice(0).join("").match(/^(?:--server)$/g)) {
      let e = createEmbed()
        .setTitle(`${member.user.tag}`)
        .setURL(`${member.user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
        .setColor(color)
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

    let memava = member.user.avatarURL({ format: "png", dynamic: true })
    let color = message.member.displayHexColor
    let e = createEmbed()
      .setTitle(`${member.user.tag}`)
      .setURL(`${member.user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
      .setColor(color)
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp();

    if (memava.split(".").pop() === "gif") {
      e.setImage(`${memava}?size=4096`);

      return message.channel.send(e)
    } else {
      e.setImage(`${memava}?size=4096`)

      return message.channel.send(e)
    }
  }
};

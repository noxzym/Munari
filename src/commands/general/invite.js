const Discord = require("discord.js-light");
module.exports = {
  name: "invite",
  aliases: ["inv"],
  category: "General",
  descriptions: "Give link invite bot",
  usage: "invite",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let inviteEmbed = new Discord.MessageEmbed()
      .setTitle("Click Here For Invite Me to Your Server")
      .setURL("https://bit.ly/Munari-Bot")
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color
      )
      .setThumbnail(client.user.avatarURL({ size: 1024 }))
      .setTimestamp()
      .setFooter(
        `Commanded by ${message.author.tag}`,
        message.author.avatarURL({ dynamic: true })
      );
    message.channel.send(inviteEmbed);
  }
};

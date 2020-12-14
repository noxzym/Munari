const Discord = require("discord.js");
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
      .setURL("https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639")
      .setColor(message.member.displayHexColor)
      .setThumbnail(client.user.avatarURL({ size: 1024 }))
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`,message.author.avatarURL({ dynamic: true }));
    message.channel.send(inviteEmbed);
  }
};

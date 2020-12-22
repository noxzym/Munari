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
      .setColor(message.member.displayHexColor)
      .setAuthor("Click This Website to Invite Me")
      // .setURL("https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639")
      .setDescription(`**[[\`top.gg\`](https://top.gg/bot/740112353483554858)] • [[\`discord.boats\`](https://discord.boats/bot/740112353483554858)] • [[\`discordbotlist.com\`](https://discordbotlist.com/bots/munari-rose)]**`)
      .setThumbnail(client.user.avatarURL({ size: 1024 }))
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));
    message.channel.send(inviteEmbed);
  }
};

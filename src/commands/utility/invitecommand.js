const { createEmbed } = require("../../utils/Function");
module.exports = {
  name: "invite",
  aliases: ["inv"],
  category: "Utility",
  descriptions: "Give link invite bot",
  usage: "invite",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    let inviteEmbed = createEmbed()
      .setColor(message.member.displayHexColor)
      .setAuthor("Invite Me!")
      .setDescription(`Do you want to invite me? click [[**\`HERE\`**](https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639)]\nAlso you can vote me in [[**\`HERE\`**](https://top.gg/bot/740112353483554858/vote)]`)
      .setThumbnail(client.user.avatarURL({ size: 4096 }))
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));
    message.channel.send(inviteEmbed);
  }
};

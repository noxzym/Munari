const { MessageEmbed, MessageAttachment } = require("discord.js");
module.exports = {
  name: "changemymind",
  aliases: ["chm"],
  category: "Fun",
  descriptions: "generati image of change my mind",
  usage: "changemymind",
  options: null,
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const text = args.join(" ");

    if (!text) return message.channel.send(`Please input some word`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (text.length > 20) return message.channel.send('You provide text oversize').then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    const msg = `https://vacefron.nl/api/changemymind?text=${text}`
    const ath = new MessageAttachment(msg, "chm.png")
    const e = new MessageEmbed()
      .setColor("RANDOM")
      .setImage('attachment://chm.png')
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp();
    message.channel.send({ files: [ath], embed: e })
  },
};
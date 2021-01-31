const fetch = require("node-fetch");
const { createEmbed } = require("../../utils/Function");

module.exports = {
  name: "dog",
  aliases: null,
  category: "Animal",
  descriptions: "GIve you dog image",
  usage: "dog",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const img = await fetch("https://dog.ceo/api/breeds/image/random").then(x => x.json())
    const embed = createEmbed("info")
      .setAuthor(`Dog Image`, "https://cdn.discordapp.com/attachments/795512730940735508/805405128324677642/dog-face_1f436.png", "https://dog.ceo/api/breeds/image/random")
      .setImage(img.message)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))

    message.channel.send(embed);
  }
};

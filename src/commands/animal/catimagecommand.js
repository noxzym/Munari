const fetch = require("node-fetch")
const { createEmbed } = require('../../utils/Function')

module.exports = {
  name: "cat",
  aliases: null,
  category: "Animal",
  descriptions: "Give you cat image",
  usage: "cat",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const { file } = await fetch("http://aws.random.cat/meow").then(x => x.json())
    const embed = createEmbed("info")
      .setAuthor(`Cat Image`, "https://cdn.discordapp.com/attachments/795512730940735508/805406121518563358/cat-face_1f431.png", "http://aws.random.cat/meow")
      .setImage(file)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
    message.channel.send(embed)
  }
}
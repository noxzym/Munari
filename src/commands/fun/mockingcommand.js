const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
  name: "mockcase",
  aliases: ["mock"],
  category: "Fun",
  descriptions: "Mocking case Word",
  usage: "mockcase <things/words/sentences>",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const input = args.join(" ");
    if (!input) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Because Invalid Input")).then(x => x.delete({ timeout: 10000 }));

    const after = await mocker(input, () => Math.round(Math.random()));
    let e = createEmbed("info")
      .setAuthor(`${client.user.username} • Mocking Case`, client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
      .setThumbnail("https://cdn.discordapp.com/attachments/406593784697192468/503049110467641345/mock.png")
      .addField("Before", input)
      .addField("After", after)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, format: "png", size: 4096 }))
    message.channel.send(e)
  }
};

async function mocker(data, randomize) {
  return data.replace(/./g, (str, i) => (randomize(str, i) ? str.toUpperCase() : str.toLowerCase()));
}
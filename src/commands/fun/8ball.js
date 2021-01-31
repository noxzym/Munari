const fetch = require("node-fetch")

module.exports = {
  name: "8ball",
  aliases: null,
  category: "Fun",
  descriptions: "",
  usage: "8ball [text]",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    if (!args[0]) return message.channel.send(`Please input some case or text`).then(msg => { msg.delete({ timeout: 10000 }) });
    if (args.length < 2) return message.channel.send(`Please input text minimal 2 word`).then(msg => { msg.delete({ timeout: 10000 }) });
    const { response } = await fetch("https://nekos.life/api/v2/8ball").then(x => x.json());

    let e = createEmbed("info")
      .setAuthor(`8Ball Command`, "https://cdn.discordapp.com/attachments/795512730940735508/805413418969595934/pool-8-ball_1f3b1.png", "https://nekos.life/api/v2/8ball")
      .addField(`❔ Questions`, `${args[0]}`)
      .addField(`<a:discord_loading:805414205440262144> Answer`, `${response}`)
    message.channel.send(e);
  }
};

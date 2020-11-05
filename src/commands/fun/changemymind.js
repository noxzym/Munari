const { MessageEmbed } = require("discord.js-light");
const fetch = require("node-fetch");

module.exports = {
  name: "changemymind",
  aliases: ['chm'],
  category: 'Fun',
  cooldown: '5',
  usage:'changemymind <text>',
  async run(bot, message, args) {
    const text = args.join(" ");

    if (!text) return message.channel.send(`Please input some word`);

    const data = await fetch(
      `https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
    ).then((res) => res.json());

    const embed = new MessageEmbed()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
      .setColor("RANDOM")
      .setDescription(
        `[Click here if the image failed to load.](${data.message})`
      )
      .setImage(data.message)
      .setTimestamp();

    message.channel.send({ embed });
  },
};
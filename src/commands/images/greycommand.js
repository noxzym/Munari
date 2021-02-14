const { createEmbed } = require("../../utils/createEmbed");
const { Util } = require("discord.js");

module.exports = {
  name: "grey",
  aliases: null,
  category: "Image",
  descriptions: "Add grey filter to image",
  usage: "grey [user/^]",
  options: null,
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    try {
      var data = await client.util.parsemsg(Util, message, args);
      var fetched = await message.channel.send(`Processing Image <a:LoadingFetch:785715659727175731>`);
    } catch {
      fetched.delete();
      return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Invalid Data")).then(x => x.delete({ timeout: 10000 }));
    };

    var img = await client.util.canvas.greyscale(data)
    let e = createEmbed("info")
      .setImage('attachment://greyscale.png')
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
    message.channel.send({ files: [img], embed: e })
    fetched.delete()
  }
}
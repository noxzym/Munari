const { MessageAttachment, Util } = require('discord.js')
const { createEmbed } = require("../../utils/createEmbed");
const alex = require('alexflipnote.js')

module.exports = {
  name: "blur",
  aliases: null,
  category: "Image",
  descriptions: "Add blur filter to image",
  usage: "blur [user]",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const { image } = new alex(client.config.alexapi)

    try {
      var data = await client.util.parsemsg(Util, message, args);
      var fetched = await message.channel.send(`Processing Image <a:LoadingFetch:785715659727175731>`);
    } catch {
      fetched.delete();
      return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Invalid Data")).then(x => x.delete({ timeout: 10000 }));
    };
    
    const img = await image.blur({ image: data })
    let ath = new MessageAttachment(img, "blur.png")

    let e = createEmbed("info")
      .setImage('attachment://blur.png')
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
    message.channel.send({ files: [ath], embed: e })
    fetched.delete()
  }
}
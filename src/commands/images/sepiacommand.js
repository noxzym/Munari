const { MessageEmbed, MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
  name: "sepia",
  aliases: null,
  category: "Image",
  descriptions: "Add sepia filter to image",
  usage: "sepia [user/^]",
  options: null,
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { image } = new alex(client.config.alexapi)

    const parse = message.content.trim().split(" ");
    const parsedata = parse[1] !== undefined && parse[1].includes("^") ? parse[1].length : 0;
    const fetchmsg = await message.channel.messages.fetch(true).then(x => {
      return x.map(x => x)[parsedata]
    })

    var fetched = await message.channel.send(`Processing Image <a:LoadingFetch:785715659727175731>`)

    const fetchattachment = fetchmsg.attachments.size !== 0 ? fetchmsg.attachments.first().url : undefined;
    const fetchembeds = fetchattachment === undefined && fetchmsg.embeds.map(x => { return x.image }).join(" ") !== '' ? fetchmsg.embeds.map(x => { return x.image.url }).join(" ") : undefined;
    const fetchmsgauthor = fetchattachment === undefined && fetchembeds === undefined && fetchmsg.content.includes("https://cdn.discordapp.com") ? fetchmsg.content.trim().split(" ")[1] : undefined;
    const mentionuser = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && message.mentions.members.first() !== undefined ? message.mentions.members.first().user.avatarURL({ size: 4096, format: "png" }) : undefined;
    const mentionuserid = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && message.mentions.members.first() === undefined && message.guild.members.cache.get(args[0]) !== undefined ? message.guild.members.cache.get(args[0]).user.avatarURL({ size: 4096, format: "png" }) : undefined;
    const fetchavatarauthor = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && mentionuser === undefined && mentionuserid === undefined ? fetchmsg.author.avatarURL({ size: 4096, format: "png" }) : undefined;

    const data = fetchattachment || fetchembeds || fetchmsgauthor || mentionuser || mentionuserid || fetchavatarauthor;
    const img = await image.sepia({ image: data })
    let ath = new MessageAttachment(img, "sepia.png")

    let e = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setImage('attachment://sepia.png')
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
    message.channel.send({ files: [ath], embed: e })
    fetched.delete()
  }
}
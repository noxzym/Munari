const { MessageEmbed } = require("discord.js");
const alex = require('alexflipnote.js')
module.exports = {
  name: "color",
  aliases: [""],
  category: "General",
  descriptions: "Show you color of hexcolor code",
  usage: "color [hexcode]",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { others } = new alex(client.config.alexapi)

    const input = args.join(' ')
    if(!input) return message.channel.send(`Usage: **\`m!color hex\`**`)

    const data = await others.color(input.replace('#', ''))
    const hex = data.hex
    const image = data.image
    const gradient = data.gradient
    const int = data.int
    const name = data.name
    const bright = data.brightness
    const rgb = data.rgb

    const embed = new MessageEmbed()
      .setColor(hex)
      .setTitle(`${name} • ${hex}`)
      .addField(`Color name`, name, true)
      .addField(`Color hex`, hex, true)
      .addField(`Color RGB`, rgb, true)
      .addField(`Color Int`, int, true)
      .addField(`Color Brightness`, bright, true)
      .addImage(gradient)
      .setThumbnail(image)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    message.channel.send(embed);
}}
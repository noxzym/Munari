const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../utils/createEmbed")
const alex = require('alexflipnote.js')

module.exports = {
  name: "color",
  aliases: null,
  category: "General",
  descriptions: "Show you color of hexcolor code",
  usage: "color [hexcode]",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const { others } = new alex(client.config.alexapi)

    const input = args.join(' ')
    if (!input) return client.commandmanager.command.get('help').run(client, message, [this.name]).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    const data = await others.color(input.replace('#', ''))
    const hex = data.hex
    const image = data.image
    const gradient = data.image_gradient
    const int = data.int
    const name = data.name
    const bright = data.brightness
    const rgb = data.rgb

    const ath = new MessageAttachment(gradient, `color.png`)
    const e = createEmbed()
      .setColor(hex)
      .setTitle(`${name} • ${hex}`)
      .setDescription(`\`\`\`asciidoc\n• Color name    :: ${name}\n• Color hex     :: ${hex}\n• Color RGB     :: ${rgb}\n• Color Int     :: ${int}\n• Color Brightness :: ${bright}\n\`\`\``)
      .setImage('attachment://color.png')
      .setThumbnail(image)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    message.channel.send({embed: e, files: [ath]});
}}
const { MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
  name: "achievement",
  aliases: ["acv"],
  category: "Fun",
  descriptions: "Generate achievement",
  usage: "acv <text>",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const { image } = new alex(client.config.alexapi)
    const input = args[0];
    if (!input) return client.commandmanager.command.get('help').run(client, commands, [this.name]).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (input.length > 20) return message.channel.send(`You provide text oversize`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    let img = await image.achievement({ text: `${input}` })
    let ath = new MessageAttachment(img, "achievement.png")

    message.channel.send(ath)
  }
}
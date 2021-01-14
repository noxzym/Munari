const { createEmbed } = require('../../utils/Function');
module.exports = {
  name: "say",
  aliases: [""],
  category: "General",
  descriptions: "",
  usage: "say [message] [options]",
  options: ["--embed"],
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    message.delete()
    const sayMessage = args.join(" ");
    if (message.content.includes('--embed')) {
      let e = createEmbed()
        .setDescription(sayMessage.replace('--embed', ''))
        .setColor(message.member.displayHexColor)
      message.channel.send(e)
    } else {
      if (!sayMessage) return;
      message.channel.send(sayMessage);
    }
  }
}
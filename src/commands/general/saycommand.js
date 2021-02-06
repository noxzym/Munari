const { Util, MessageAttachment } = require('discord.js');
const { createEmbed } = require('../../utils/Function');
module.exports = {
  name: "say",
  aliases: null,
  category: "General",
  descriptions: "I can say everything what you want",
  usage: "say [message] [options]",
  options: null,
  cooldown: "10",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    (message.guild.me.hasPermission("MANAGE_MESSAGES") || message.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) ? message.delete() : null

    const sayMessage = args.join(" ");
    if (!sayMessage && message.attachments.first() === undefined) return client.commandmanager.command.get('help').run(client, message, ['say']).then(x => { x.delete({ timeout: 5000 }) })
    
    if (message.attachments.first() !== undefined) {
      const ath = new MessageAttachment(message.attachments.first().url)
      if (!sayMessage) {
        return message.channel.send(ath)
      } else {
        return message.channel.send(sayMessage, ath);
      }
    } else {
      return message.channel.send(sayMessage);
    }
  }
}
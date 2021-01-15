const { Util } = require('discord.js');
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
    (message.guild.me.hasPermission("MANAGE_MESSAGES") || message.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) ? message.delete() : null

    const sayMessage = args.join(" ");

    if (message.content.includes('--embed')) {
      let e = createEmbed()
        .setDescription(sayMessage.replace('--embed', ''))
        .setColor(message.member.displayHexColor)
      return message.channel.send(e)
    }

    if (!sayMessage) return client.commandmanager.command.get('help').run(client, message, ['say']).then(x => { x.delete({ timeout: 5000 }) })

    const permiss = [
      "ADMINISTRATOR",
      "MANAGE_GUILD",
      "MENTION_EVERYONE",
      "KICK_MEMBERS",
      "BAN_MEMBERS"
    ]
    const memberperms = message.channel.permissionsFor(message.author).toArray()
    
    memberperms.filter(x => permiss.includes(x)) ? message.channel.send(sayMessage) : message.channel.send(Util.cleanContent(sayMessage));
  }
}
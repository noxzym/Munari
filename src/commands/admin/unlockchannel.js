const {  MessageEmbed  } = require('discord.js')
module.exports = {
  name: "unlockchannel",
  aliases: ["unlockch"],
  category: "Administration",
  descriptions: "Make a channel can be access everyone",
  usage: "unlockchannel <channel>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message) {
    const prefix = 'm!'
    if(!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`You don't have permissions \`MANAGE_CHANNELS\` or \`ADMINISTRATOR\``)
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS" || "ADMINISTRATOR")) return message.channel.send(`I don't have permissions \`MANAGE_CHANNELS\` or \`ADMINISTRATOR\``)
    
    const channel = message.mentions.channels.first() || message.channel;
    if(!channel) return message.channel.send(`Usage: ${prefix + this.usage}`)
    try {
      var react = await message.channel.send(`Are you sure to Unlock Channel **\`${channel.name}\`**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, {time: 60000});
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Unocked Channel **\`${channel.name}\`** successful!`)
            channel.updateOverwrite(message.guild.id, {
              SEND_MESSAGES: true,
            });
            message.channel.send(`channel ${channel.name} has unlocked now!`)
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Unlocked Channel **\`${channel}\`** has canceled!`)
            break;

          default:
            reaction.users.remove(user).catch(console.error)
            break;
        }
      })
      collector.on('end', () => {
        react.reactions.removeAll().catch(console.error);
      })
    } catch (e) {
      console.log(e)
    }
  },
};
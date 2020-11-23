const {  MessageEmbed  } = require('discord.js')
module.exports = {
  name: "lockchannel",
  aliases: ["lockch", "lch"],
  category: "Administration",
  descriptions: "Make a channel can`t be access to everyone",
  usage: "lockchannel <channel>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
    if(!message.member.hasPermission('MANAGE_CHANNELS' || 'ADMINISTRATOR')) return message.channel.send(`You couldn't have permissions \`MANAGE_CHANNELS\` or \`ADMINISTRATOR\``)
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`I couldn't have permissions \`MANAGE_CHANNELS\``)

    const prefix = 'm!'
    let channel = message.mentions.channels.first();
    if(!channel) {
      return message.channel.send(`Usage: ${prefix + this.usage}`)
    }

    try {
      var react = await message.channel.send(`Are you sure to Lock Channel **\`${channel.name}\`**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, {time: 60000});
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Locked Channel **\`${channel.name}\`** successful!`)
            channel.updateOverwrite(message.guild.id, {
              SEND_MESSAGES: false,
            });
            message.channel.send(`Channel ${channel.name} has locked now`)
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Locked Channel **\`${channel}\`** has canceled!`)
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
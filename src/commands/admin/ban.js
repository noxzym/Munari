const Discord = require("discord.js")
module.exports = {
  name: "ban",
  aliases: [""],
  category: "Administration",
  descriptions: "Ban a user from guild",
  usage: "ban <user> [reason]",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
    const prefix = 'm!'
    if (!message.member.hasPermission("ADMINISTRATOR" || "BAN_MEMBERS")) return message.reply("You don't have permissions \`BAN_MEMBERS\` or \`ADMINISTRATOR\`");
    if (!message.guild.me.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR")) return message.channel.send(`Missing permissions for me: \`BAN_MEMBERS\` or \`ADMINISTRATOR\``)
    let member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(`usage: ${prefix + this.usage}`)
    if (!member.kickable)
      return message.channel.send("This member can't be kicked");

    if (
      message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0
    ) {
      return message.channel.send(
        `My Highest role must be higher than **\`${member.user.username}\`** highest role!`
      );
    }

    if (member.user.id === message.author.id) {
      return message.channel.send(`You can't banned yourself`)
    }
    if (member.user.id === message.client.user.id) {
      return message.channel.send(`I can't banned myself`)
    }
    let reason = args.slice(1).join(' ');
    if (!reason) {
      reason = " - ";
    }
    else {
      reason = `${reason}`
    }

    try {
      var react = await message.channel.send(`Are you sure to ban **\`${member.user.tag}\`**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Banned **\`${member.user.tag}\`** successful!`)
            member.ban(reason).catch(e => message.channel.send(`Sorry i couldn't kick this user because ${e}`))
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Banned **\`${member.user.tag}\`** has canceled!`)
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
  }
};

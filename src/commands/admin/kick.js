const Discord = require("discord.js-light")
const Prefix = require('discord-prefix')
module.exports = {
  name: "kick",
  aliases: [""],
  category: "Administration",
  descriptions: "kick a user from guild",
  usage: "kick <user>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  async run(bot, message, args) {
    message.delete();
    const prefix = Prefix.getPrefix(message.guild.id) || 'm!'
    if (!message.member.hasPermission("ADMINISTRATOR" || "KICK_MEMBERS")) return message.reply("You don't have permissions \`KICK_MEMBERS\` or \`ADMINISTRATOR\`");
    let member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(`usage: ${prefix + this.usage}`)
    if(!member.kickable)
      return message.channel.send("This member can't be kicked");

    if (
      message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0
    ) {
      return message.channel.send(
        `My Highest role must be higher than **\`${member.user.username}\`** highest role!`
      );
    }
    
    if(member.id === message.author.id) {
      return message.channel.send(`You can't kicked yourself`)
    }
    let reason = args.slice(1).join(' ');
    if(!reason) {
      reason = " - ";
    }
    else {
      reason = `${reason}`
    }
  
    try {
      var react = await message.channel.send(`Are you sure to Kick **\`${member.user.tag}\`**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter);
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Kicked **\`${member.user.tag}\`** successful!`)
            member.kick(reason).catch(e => message.channel.send(`Sorry i couldn't kick this user because ${e}`))
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Kicked **\`${member.user.tag}\`** has canceled!`)
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
}}

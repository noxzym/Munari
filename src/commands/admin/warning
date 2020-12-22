const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
  name: "warning",
  aliases: ["warn"],
  category: "Administration",
  descriptions: "Make warning to user",
  usage: "warning <user> <reason>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
  const prefix = 'm!'
  if(!message.member.hasPermission("KICK_MEMBERS" || "BAN_MEMBERS" || "ADMINISTRATOR")) return message.channel.send(`You don't have permissions \`KICK_MEMBERS\` or \`BAN_MEMBERS\` or \`ADMINISTRATOR\``);
  let reason = args.slice(1).join(' ');
    let member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!member) return message.channel.send(prefix + this.usage);
  
  if (message.mentions.users.size < 1) return message.channel.send('Please mention user first');
  if (reason.length < 1) return message.reply('Please input reason why this user get warning');
  
    try {
      var react = await message.channel.send(`Are you sure to warning user **\`${member.user.tag}\`**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, {time: 60000});
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Warned user **\`${member.user.tag}\`** successful!`)
            member.send(`${member.tag} Kamu telah di warning`).catch(e => message.channel.send(`I can't send DM to this user because ${e}`))
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Warned user **\`${member.user.tag}\`** has canceled!`)
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
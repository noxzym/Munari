const Discord = require("discord.js-light");
module.exports = {
  name: "unmute",
  aliases: [""],
  category: "Administration",
  descriptions: "Make a user can send message again",
  usage: "unmute <user>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
    const prefix = 'm!'
    if(!message.member.hasPermission('MANAGE_ROLES' || 'ADMINISTRATOR')) return message.channel.send("You don't have permissions \`MANAGE_ROLES\` or \`ADMINISTRATOR\`");
  
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
  if(!tomute) return message.channel.send(`Usage: ${prefix + this.usage}`);
  
  let muterole = message.guild.roles.cache.find(r => r.name === 'MunaMute');
  
    try {
      var react = await message.channel.send(`Are you sure to unmute **\`${tomute.user.tag}\`**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, {time: 60000});
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Unmuted user **\`${tomute.user.tag}\`** successful!`)
            tomute.roles.remove(muterole.id)
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Unmuted user **\`${tomute.user.tag}\`** has canceled!`)
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
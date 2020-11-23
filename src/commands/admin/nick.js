const Discord = require("discord.js");
module.exports = {
  name: "nick",
  aliases: [""],
  category: "Administration",
  descriptions: "Manage nickname user",
  usage: "nick <user> [newnickname]",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
    const prefix = 'm!'
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES' || 'ADMINISTRATOR')) return message.channel.send(`I don't have permission \`MANAGE_NICKNAMES\``);
        if(!message.member.hasPermission('MANAGE_NICKNAMES' || 'ADMINISTRATOR')) return message.channel.send(`You don't have permissions \`MANAGE_NICKNAMES\``);

        let mentionMember = message.mentions.members.first() ;
        if(!mentionMember) return message.channel.send(`Usage: ${prefix + this.usage}`);
        let newNickname = args.slice(1).join(' ');
    try {
      var react = await message.channel.send(`Are you sure to change nickname user **\`${mentionMember.user.tag}\`** to **${newNickname}**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, {time: 60000});
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Changed nickname user **\`${mentionMember.user.tag}\`** to **\`${newNickname}\`** successful!`)
            mentionMember.setNickname(newNickname).catch(e => message.channel.send(`I can't change nickname this user because ${e}`))
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Muted **\`${mentionMember.user.tag}\`** has canceled!`)
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
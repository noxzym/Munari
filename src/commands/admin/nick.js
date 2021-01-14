module.exports = {
  name: "nick",
  aliases: null,
  category: "Administration",
  descriptions: "Manage nickname user",
  usage: "nick <user> [newnickname]",
  options: null,
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    if (!message.guild.me.hasPermission('MANAGE_NICKNAMES' || 'ADMINISTRATOR')) return message.channel.send(`I don't have permission \`MANAGE_NICKNAMES\``).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (!message.member.hasPermission('MANAGE_NICKNAMES' || 'ADMINISTRATOR')) return message.channel.send(`You don't have permissions \`MANAGE_NICKNAMES\``).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    let mentionMember =
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || 
      x.user.username === `${args[0]}`) ||
      message.mentions.members.first()
    if (!mentionMember) return client.commandmanager.command.get('help').run(client, message, [this.name]).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    let newNickname = args.slice(1).join(' ');
    try {
      var react = await message.channel.send(`Are you sure to change nickname user **\`${mentionMember.user.tag}\`** to **${newNickname}**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, { time: 60000 });
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
  }
}
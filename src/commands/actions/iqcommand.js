module.exports = {
  name: "iq",
  aliases: null,
  category: "Actions",
  descriptions: "Gacha Iq",
  usage: "iq [user]",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {
    const iq = Math.floor(Math.random() * 200) + 1;
    const member =
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
      message.mentions.members.first() ||
      message.member
    if (!member) {
      message.channel.send(`Hold a moment <a:loading1:753610786991112282>`).then(msg => { setTimeout(function () { msg.edit(`${message.author} have ${iq} IQ`) }, 5000) }) }
    if (member) {
      message.channel.send(`Hold a moment <a:loading1:753610786991112282>`) .then(msg => { setTimeout(function () { msg.edit(`${member} have ${iq} IQ`) }, 5000) })
    }
  }
}
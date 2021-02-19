module.exports = {
  name: "announcement",
  aliases: ["anc"],
  category: "Moderation",
  descriptions: "Send Announcement message to specific channel",
  usage: "announcement <#channel> <json embed>",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["MANAGE_MESSAGES", "EMBED_LINKS"],
    userperms: ["MANAGE_MESSAGES"]
  },
  async run(client, message, args) {
    let data;
    try {
      data = JSON.parse(args.slice(1).join(' ').toString())
    } catch (e) {
      return message.channel.send({ embed: { color: 'ff0000', description: `Please input like **[\`this\`](https://raw.githubusercontent.com/BlazeDexX/blazedexx.github.io/master/index.html)**` } }).then(x => { x.delete({ timeout: 10000 }) })
    }

    let channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first()
    if (!channel) return message.channel.send(`Please mentions channel first`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    channel.send({
      embed: data
    });
  }
}
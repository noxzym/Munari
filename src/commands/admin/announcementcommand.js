const Discord = require('discord.js')
module.exports = {
  name: "announcement",
  aliases: ["anc"],
  category: "Administration",
  descriptions: "Send Announcement message to specific channel",
  usage: "announcement <#channel> <json embed>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_MESSAGES")) return message.channel.send(`You don't have permissions \`ADMINISTRATOR\``);

    let data;
    try {
      data = JSON.parse(args.slice(1).join(' ').toString())
    } catch (e) {
      return message.channel.send({ embed: { color: 'ff0000', description: `Please input like **[\`this\`](https://hastebin.com/ipupotitis.rb)**` } }).then(x => { x.delete({ timeout: 5000 }) })
    }

    let color = data.color !== undefined ? data.color : '0099ff';
    let authorname = data.author && data.author.name !== undefined ? data.author.name : message.guild.name;
    let authorurl = data.author && data.author.icon_url !== undefined ? data.author.icon_url : message.guild.iconURL({ size: 4096, dynamic: true });
    let title = data.title !== undefined ? data.title : "Announcement";
    let url = data.url !== undefined ? data.url : null;
    let description = data.description !== undefined ? data.description : null;
    let footertext = data.footer && data.footer.text !== undefined ? data.footer.text : message.author.name;
    let footericon = data.footer && data.footer.icon_url !== undefined ? data.footer.icon_url : message.author.avatarURL({ dynamic: true });

    let channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first()
    if (!channel) return message.channel.send(`Please input channel first`)
    channel.send({
      embed:
      {
        color: color,
        author: {
          name: authorname,
          icon_url: authorurl
        },
        title: title,
        url: url,
        description: description,
        timestamp: new Date(),
        footer: {
          icon_url: footericon,
          text: footertext
        }
      }
    });
  }
}
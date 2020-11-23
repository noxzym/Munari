const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "blurple",
  aliases: [""],
  category: "Image",
  descriptions: "Brightniess avatar",
  usage: "blurple [user]",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const member =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.member;
    if(!member) return message.channel.send(`Please mention members first`)
    const { body } = await superagent.get(
      `https://neko-love.xyz/api/v2/blurple?url=${member.user.avatarURL({
        dynamic: false, size: 4096
      })}`
    );
    const embed = new MessageEmbed()
      .setColor(
        message.member.roles.cache
          .sort((a, b) => b.position - a.position)
          .first().color
      )
      .setTitle(`${member.user.username}`)
      .setURL(body.url)
      .setImage(body.url)
      .setTimestamp();
    message.channel.send({ embed });
  }
};

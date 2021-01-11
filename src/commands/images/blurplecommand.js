const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = {
  name: "blurple",
  aliases: null,
  category: "Image",
  descriptions: "Brightniess avatar",
  usage: "blurple [user]",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const member =
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
      message.mentions.members.first() ||
      message.member;
    const { body } = await superagent.get(`https://neko-love.xyz/api/v2/blurple?url=${member.user.avatarURL({
      dynamic: false, size: 4096
    })}`
    );
    var fetchmsg = await message.channel.send(`Fetching Image <a:LoadingFetch:785715659727175731>`)

    const embed = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle(`${member.user.username}`)
      .setURL(body.url)
      .setImage(body.url)
      .setTimestamp();
    message.channel.send({ embed });
    fetchmsg.delete()
  }
};

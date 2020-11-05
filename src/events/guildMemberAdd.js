const db = require("quick.db");
const Discord = require("discord.js-light");
module.exports = {
  name: "guildMemberAdd",
  async run(client, member) {
    let chx = db.get(`welchannel_${member.guild.id}`);
    if (chx === null) {
      return;
    }

    let message = db.get(`messagewelcome_${member.guild.id}`);
    let image = null || db.get(`imagewelcome_${member.guild.id}`);
    const welcome = new Discord.MessageEmbed()
      .setColor("#00ff05")
      .setAuthor(
        `Welcome to ${member.guild.name}`,
        member.guild.iconURL({ dynamic: true })
      )
      .setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 }))
      .setDescription(`${message}`)
      .setTimestamp()
      .setImage(image);
    const channel = member.guild.channels.cache.get(chx);
    channel.send(welcome).then(msg => {
      msg.delete({ timeout: 60000 });
    });
  }
};

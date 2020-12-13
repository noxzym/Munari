const { MessageEmbed } = require("discord.js");
const user = require('user-instagram')
module.exports = {
  name: "instagram",
  aliases: ["insta", "ig"],
  category: "General",
  descriptions: "Display instagram information",
  usage: "instagram <username>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    try {
      const username = args[0];
      if(!username) return message.channel.send(`You must input some instagram username`)

      var fetchmsg = await message.channel.send(`Fetching Data <a:LoadingFetch:785715659727175731>`)

      const get = await user(`${username}`)
      
      const fullname = get.fullName;
      const userig = get.username;
      const bio = get.biography === null ? "None" : get.biography;
      const follower = get.subscribersCount;
      const following = get.subscribtions;
      const priv = get.isPrivate ? "Yes :lock:" : "No :unlock:";
      const thm = get.profilePicHD

      let e = new MessageEmbed()
        .setColor(
          message.member.roles.cache
            .sort((a, b) => b.position - a.position)
            .first().color
        )
        .setTitle(`Instagram Account • ${fullname}`)
        .setURL(`https://www.instagram.com/${username}`)
        .setThumbnail(`${thm}`)
        .setDescription(`**Account Information\n\`\`\`asciidoc\n• Username  :: ${userig}\n• Fullname  :: ${fullname}\n• Biography :: ${bio}\n• Followers :: ${follower}\n• Following :: ${following}\n• Private   :: ${priv}\n\`\`\`**`);

      await message.channel.send(e);
      fetchmsg.delete()
    } catch (error) {
      console.log(error)
      message.channel.send("Cannot find that username or the service maintenance");
      fetchmsg.delete()
    }
  }
};

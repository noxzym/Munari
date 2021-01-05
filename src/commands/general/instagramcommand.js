const { MessageEmbed } = require("discord.js");
const axios = require("axios");

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
      if (!username) return message.channel.send(`You must input some instagram username`)

      var fetchmsg = await message.channel.send(`Fetching Data <a:LoadingFetch:785715659727175731>`)

      const response = await axios.get(`https://api.hansputera.me/instagram/${username}`);
      const { data } = response;

      const get = data.graphql.user;

      const fullname = get.full_name;
      const userig = get.username;
      const bio = get.biography === null ? "None" : get.biography;
      const follower = get.edge_followed_by.count;
      const following = get.edge_follow.count;
      const priv = get.is_private ? "Yes 🔒" : "No 🔓";

      const thm = get.profile_pic_url_hd

      let e = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setTitle(`Instagram Account • ${fullname}`)
        .setURL(`https://www.instagram.com/${username}`)
        .setThumbnail(`${thm}`)
        .setDescription(`**Account Information\n\`\`\`asciidoc\n• Username  :: ${userig}\n• Fullname  :: ${fullname}\n• Biography :: ${bio}\n• Followers :: ${follower}\n• Following :: ${following}\n• Private   :: ${priv}\n\`\`\`**`);
      await message.channel.send(e);
      fetchmsg.delete()
    } catch (error) {
      message.channel.send("Cannot find that username or the service maintenance");
      fetchmsg.delete()
    }
  }
};
